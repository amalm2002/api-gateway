
import { Request, Response, NextFunction } from 'express'
import restaurantRabbitMqClient from '../rabbitmq/client'
import { Message } from '../../../interfaces/interface';

export default class SubscriptionPlanController {

    getAllSubscriptionPlandetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log('ivide ethyyyyyyy');
            const operation = 'Get-All-Subscription-Plan'
            const response: Message = (await restaurantRabbitMqClient.produce({}, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('error on getAllSubscriptionPlandetails side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}