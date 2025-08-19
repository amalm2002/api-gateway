import { Request, Response, NextFunction } from "express";
import AsyncHandler from "express-async-handler";
import { AuthUtility } from "../../utils/authUtil";


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

const authUtility = new AuthUtility();

export const isValidated = (requiredRole: string) =>
    AsyncHandler((req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.trim().split(" ")[1];

            if (!token) {
                res.status(401).json({ success: false, message: "No token provided" });
                return;
            }

            try {
                const decoded = authUtility.verifyAccessToken(token);

                if (decoded.role !== requiredRole) {
                    res.status(403).json({ success: false, message: "Access denied" });
                    return;
                }

                req.user = { id: decoded.id, role: decoded.role };
                next();
            } catch (error) {
                res.status(401).json({ success: false, message: (error as Error).message });
            }
        } catch (error) {
            console.log("error in isValidated:", (error as Error).message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    });



export const refreshToken = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.trim().split(" ")[1] || req.body.token;

        if (!token) {
            res.status(401).json({ success: false, message: "Token is missing" });
            return;
        }

        try {
            const decoded = authUtility.verifyRefreshToken(token);
            const tokens = authUtility.generateTokens(decoded.id, decoded.role);

            res.status(200).json({
                success: true,
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                message: "New token generated successfully"
            });
        } catch (error) {
            res.status(401).json({ success: false, message: (error as Error).message });
        }
    } catch (error) {
        console.log("error in refreshToken:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});