import { Request, Response } from "express";
import { UserService } from "../../user/config/user.client";
import { UserInterface } from "../../../interfaces/interface";
import { AuthClient } from "../../auth/config/auth.client";
import redisClient from "../../../config/redis.config";


export default class AdminController {
    getAllUsers = (req: Request, res: Response) => {
        try {
            UserService.GetAllUsers({}, (err: any, result: { users: UserInterface[] }) => {
                if (err) {
                    return res.status(401).json({ message: err });
                }
                res.status(200).json(result);
            });
        } catch (error) {
            console.log('Error in getAllUsers AdminController:', (error as Error).message);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    blockUsers = (req: Request, res: Response) => {
        try {
            UserService.BlockUser({ userId: req.params.id }, (err: any, result: { success: boolean; message: string, isActive: boolean, userId: string }) => {

                if (err) {
                    res.status(400).json({ message: err })
                }

                console.log('response :', result);
                res.status(200).json(result)
            })
        } catch (error) {
            console.log('error on blocakUsers :', (error as Error).message);
            res.status(500).json({ message: 'internal server error' })
        }
    }

    // blockUsers = (req: Request, res: Response) => {
    //     try {
    //         UserService.BlockUser({ userId: req.params.id }, async (err: any, result: any) => {
    //             if (err) return res.status(400).json({ message: err });

    //             const redisKey = `blocked_user:${result.userId}`;
    //             const role = req.user?.role || 'User';
    //             const token = req.headers.authorization?.trim().split(" ")[1];

    //             if (!result.isActive) {
    //                 // BLOCK: Save block info + blacklist token
    //                 await redisClient.set(redisKey, 'true');

    //                 if (token) {
    //                     await new Promise((resolve, reject) => {
    //                         AuthClient.BlacklistToken({ userId: result.userId, role, token }, (err: any, response: any) => {
    //                             console.log('================================================');
    //                             console.log(err);
    //                             console.log('================================================');
    //                             if (err) return reject(err);
    //                             console.log('Token blacklisted:', response);
    //                             resolve(response);
    //                         });
    //                     });
    //                 }
    //             } else {
    //                 // UNBLOCK: Remove block info + unblacklist
    //                 await redisClient.del(redisKey);

    //                 await new Promise((resolve, reject) => {
    //                     AuthClient.UnblacklistToken({ userId: result.userId, role }, (err: any, response: any) => {
    //                         if (err) return reject(err);
    //                         console.log('Token unblacklisted:', response);
    //                         resolve(response);
    //                     });
    //                 });
    //             }

    //             return res.status(200).json(result);
    //         });
    //     } catch (error) {
    //         console.error('Error on blockUsers:', error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // }

}