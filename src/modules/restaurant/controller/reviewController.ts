import { Request, Response, NextFunction } from 'express'
import restaurantRabbitMqClient from '../rabbitmq/client'
import { AuthResponse, Message } from '../../../interfaces/interface'

export default class reviewController {
    addFoodReview = async (req: Request, res: Response, NextFunction: NextFunction) => {
        try {
            const { itemId, rating, comment, orderId, userId, isEdit } = req.body
            const operation = 'Add-Food-Review'
            const response: Message = (await restaurantRabbitMqClient.produce({
                itemId,
                orderId,
                userId,
                rating,
                comment,
                isEdit
            }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.error('this error showing on the add review on food', error)
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    deleteFoodReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, orderId, itemId } = req.body;
            const operation = 'Delete-Food-Review';
            const response: Message = (await restaurantRabbitMqClient.produce({
                userId,
                orderId,
                itemId,
            }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in deleteFoodReview:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };

    getUserReviewForFoodItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, orderId, itemId } = req.body;
            const operation = 'Get-User-Review-For-Food-Item';
            const response: Message = (await restaurantRabbitMqClient.produce({
                userId,
                orderId,
                itemId,
            }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in getUserReviewForFoodItem:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };
}