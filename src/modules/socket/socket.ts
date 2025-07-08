
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from 'jsonwebtoken'
import { AuthClient } from "../auth/config/auth.client";
import { Tokens, AuthenticatedSocket } from "../../interfaces/interface";
import mongoose from 'mongoose'



const userSocketMap: { [key: string]: string } = {};

export const setupSocketIO = (server: HttpServer): SocketIOServer => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CORS_ORGIN,
            methods: ['GET', 'POST', 'PATCH'],
            credentials: true
        },
    })

    console.log(`Socket.IO initialized with CORS origin: ${process.env.CORS_ORGIN}`);

    io.use(authenticateSocket);

    io.on("connection", (socket: AuthenticatedSocket) => {
        handleSocketConnection(socket, io)
    })

    return io
}

const refreshTokenWithAuthClient = (refreshToken: string): Promise<Tokens> => {
    return new Promise((resolve, reject) => {
        AuthClient.RefreshToken({ token: refreshToken }, (err: any, result: Tokens) => {
            if (err) {
                reject(new Error('Invalid refreshToken'))
            }
            resolve(result)
        })
    })
}

const authenticateSocket = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    const { token, refreshToken } = socket.handshake.query as { token: string; refreshToken: string };

    if (!token) {
        console.log("Authentication error: Missing token");
        return next(new Error('Authentication error: Missing token'))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            clientId: string;
            role: 'User' | 'Admin' | 'DeliveryBoy' | 'Restaurant';
        }

        socket.decoded = decoded
        console.log(`Authenticated ${decoded.role}:${decoded.clientId}`);
        return next()

    } catch (error) {
        if (!refreshToken) {
            console.log('Authentication error: Invalid token, no refresh token');
            return next(new Error('Authenticated error :invalid token,no refresh token'))
        }

        try {
            const result = await refreshTokenWithAuthClient(refreshToken);
            socket.emit('token-updated', {
                token: result.accessToken,
                refreshToken: result.refreshToken
            })

            const decoded = jwt.verify(result.accessToken, process.env.JWT_SECRET as string) as {
                clientId: string;
                role: 'User' | 'Admin' | 'DeliveryBoy' | 'Restaurant';
            }

            socket.decoded = decoded;
            console.log(`Token refreshed for ${decoded.role}: ${decoded.clientId}`);
            return next();
        } catch (error) {
            console.error("Authentication error: Token refresh failed", error);
            return next(new Error("Authentication error: Token refresh failed"));
        }
    }
}

const handleSocketConnection = async (socket: AuthenticatedSocket, io: SocketIOServer) => {
    if (!socket.decoded) {
        console.log('Missing decoded token,disconnecting');
        socket.disconnect()
        return
    }

    const { clientId: userId, role } = socket.decoded;
    console.log(`${role} connected: ${userId}`);

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`Updated userSocketMap: ${JSON.stringify(userSocketMap)}`);
    }

    socket.join(`${role.toLocaleLowerCase()}:${userId}`)

    socket.on('register', (data: { userId: string; role: string }) => {
        if (data.userId && data.userId !== "undefined") {
            userSocketMap[data.userId] = socket.id;
            console.log(`Re-registered ${data.role} ${data.userId} in userSocketMap: ${JSON.stringify(userSocketMap)}`);
        }
    })

    if (role === "Admin") {
        setupAdminEvents(socket, io, userId);
    } else if (role === "User") {
        setupUserEvents(socket, io, userId);
    } else if (role === "Restaurant") {
        setupRestaurantEvents(socket, io, userId);
    } else if (role === "DeliveryBoy") {
        setupDeliveryBoyEvents(socket, io, userId);
    }
}

const setupAdminEvents = (socket: AuthenticatedSocket, io: SocketIOServer, userId: string) => {

    socket.on('block-user', ({ userId: targetUserId }: { userId: string }) => {
        console.log(`Received block-user event fro targetUserId :${targetUserId} from admin :${userId}`);
        const targetSocketId = userSocketMap[targetUserId]

        if (targetSocketId) {
            console.log(`Emitting user-blocked event to socket: ${targetSocketId} for user: ${targetUserId}`);
            io.to(targetSocketId).emit("user-blocked");
        } else {
            console.error(`No socket found for user: ${targetUserId} in userSocketMap`);
            socket.emit("error", {
                message: `No socket found for user ${targetUserId}`,
                code: "USER_NOT_FOUND",
            });
        }
    })
}

const setupUserEvents = (socket: AuthenticatedSocket, io: SocketIOServer, userId: string) => {
    socket.on('order-placed', ({ restaurantId: targetRestaurantId, orderId }: { restaurantId: string, orderId: string }) => {
        console.log(`Received the order-placed event for targetId:${targetRestaurantId} from the user:${userId}`);
        const targetSocketId = userSocketMap[targetRestaurantId];
        if (targetSocketId) {
            console.log('order id :', orderId);

            console.log(`Emitting order-created event to socket: ${targetSocketId} for restaurant: ${targetRestaurantId}`);
            io.to(targetSocketId).emit("order-created", { orderId, restaurantId: targetRestaurantId });
        } else {
            console.error(`No socket found for restaurant: ${targetRestaurantId} in userSocketMap`);
            socket.emit("error", {
                message: `No socket found for restaurant ${targetRestaurantId}`,
                code: "RESTAURANT_NOT_FOUND",
            });
        }
    });
};



const setupRestaurantEvents = (socket: AuthenticatedSocket, io: SocketIOServer, restaurantId: string) => {
    socket.on('order-accepted', ({ orderId, restaurantId: targetRestaurantId, deliveryBoys, restaurantDetails }) => {
        console.log(`Received order-accepted event for orderId: ${orderId} from restaurant: ${targetRestaurantId}`);
        deliveryBoys.forEach((deliveryBoy: { _id: string }) => {
            const deliveryBoyId = deliveryBoy._id;
            const targetSocketId = userSocketMap[deliveryBoyId];
            if (targetSocketId) {
                console.log(`Emitting delivery-order-notification to socket: ${targetSocketId} for deliveryBoy: ${deliveryBoyId}`);
                io.to(targetSocketId).emit('delivery-order-notification', {
                    orderId,
                    restaurantId: targetRestaurantId,
                    restaurantDetails,
                });
            } else {
                console.error(`No socket found for deliveryBoy: ${deliveryBoyId} in userSocketMap`);
            }
        });
    });
};

const setupDeliveryBoyEvents = (socket: AuthenticatedSocket, io: SocketIOServer, deliveryBoyId: string) => {
    socket.on('accept-delivery-order', ({ orderId, deliveryBoyId: targetDeliveryBoyId }) => {
        console.log(`Delivery boy ${targetDeliveryBoyId} accepted order ${orderId}`);
        io.emit('delivery-boy-accepted', { orderId, deliveryBoyId: targetDeliveryBoyId });
    });

    socket.on('cancel-delivery-order', ({ orderId, deliveryBoyId: targetDeliveryBoyId }) => {
        console.log(`Delivery boy ${targetDeliveryBoyId} canceled order ${orderId}`);
    });

};


