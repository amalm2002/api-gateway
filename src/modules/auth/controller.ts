import { Request, Response, NextFunction } from "express";
import { AuthClient } from "./config/auth.client";
import AsyncHandler from "express-async-handler";
import { UserCredentials, Tokens } from "../../interfaces/interface";


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
        }
    }
}

export const isValidated = (requiredRole: string) =>
    AsyncHandler((req: Request, res: Response, next: NextFunction) => {
        try {

            const token = req.headers.authorization?.trim().split(" ")[1]

            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'No token provided'
                })
                return
            }

            AuthClient.IsAuthenticated({ token, requiredRole }, (err: any, result: UserCredentials) => {
                if (err) {
                    console.log(err);

                    console.log('this error show on isValidate side');
                    res.status(401).json({ success: false, message: err })
                    return
                }
                if (result.message) {
                    res.status(
                        result.message.includes("Access denied") ? 403 : 401
                    ).json({ success: false, message: result.message });
                    return;
                }

                req.user = { id: result.userId, role: result.role }
                next()
            })

        } catch (error) {
            console.log('error on the auth service isValidate function', (error as Error).message);
        }
    })

export const refreshToken = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.trim().split(" ")[1] || req.body.token

        if (!token) {
            res.status(401).json({ success: false, message: 'Token is missing' })
            return
        }

        await new Promise<void>((resolve) => {
            AuthClient.RefreshToken({ token }, (err: any, result: Tokens) => {
                if (err) {
                    console.log('grpc refresh token side :', err);
                    res.status(401).json({ success: false, message: 'invalid refresh token' })
                    return resolve()
                }
                if (result.message) {
                    res.status(401).json({
                        success: false,
                        message: result.message
                    })
                    return resolve()
                }

                res.status(200).json({
                    success: true,
                    token: result.accessToken,
                    refreshToken: result.refreshToken,
                    message: 'New token generated successfully'
                })
                resolve()
            })
        })

    } catch (error) {
        console.log('error on the refreshtoken side auth-service', (error as Error).message);

    }
})