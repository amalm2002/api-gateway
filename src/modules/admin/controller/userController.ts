import { Request, Response } from "express";
import { UserService } from "../../user/config/user.client";
import { UserInterface } from "../../../interfaces/interface";


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
            UserService.BlockUser({ userId: req.params.id }, (err: any, result: { success: boolean; message: string, isActive: boolean }) => {

                if (err) {
                    res.status(400).json({ message: err })
                }
                
                // console.log('response :', result);
                res.status(200).json(result)
            })
        } catch (error) {
            console.log('error on blocakUsers :', (error as Error).message);
            res.status(500).json({ message: 'internal server error' })
        }
    }

}