import { Response, Request, NextFunction } from "express";
import restaurantRabbitMqClient from '../../restaurant/rabbitmq/client'
import { Message } from "../../../interfaces/interface";



export default class restaurantController {

    getAllRestaurants = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { search, status } = req.query; 
            const operation = 'Get-All-Restaurants';
            const payload = { search: search as string, status: status as string };
            const response: Message = (await restaurantRabbitMqClient.produce(payload,
                operation)) as Message
            res.status(200).json(response)
        } catch (error: any) {
            console.log('error has show on restaurant-controller getAllRestaurants api-gateway side :', error);
            res.status(500).json({ message: 'internal server error' })
        }
    }

    findRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const restaurantId = req.params.id
            const operation = 'Find-Id-By-The-Restaurant'
            const response: Message = (await restaurantRabbitMqClient.produce({
                restaurantId
            }, operation)) as Message
            res.status(200).json(response)

        } catch (error) {
            console.log('error has show on restaurant-controller findRestaurantById api-gateway side :', error);
            res.status(500).json({ message: 'internal server error' })
        }
    }

    verifyRestaurantDocs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const restaurantId = req.params.id
            const operation = 'Verify-Restaurant-Documents'
            const response: Message = (await restaurantRabbitMqClient.produce({
                restaurantId
            }, operation)) as Message
            res.status(200).json(response)

        } catch (error) {
            console.log('the error has to show on the verify docs side :', error);
            res.status(500).json({ message: 'internal server error' })
        }
    }

    rejectedRestaurantDocs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { restaurantId, rejectionReason } = req.body
            const operation = 'Rejected-Restaurant-Documents'
            const response: Message = (await restaurantRabbitMqClient.produce({
                restaurantId, rejectionReason
            }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('the error has to show on the rejected docs side :', error);
            res.status(500).json({ message: 'internal server error' })
        }
    }

    addNewSubScriptionPlan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id, name, price, period, description, features, popular } = req.body;
            const operation = 'Add-New-Subscription';
            const response: Message = (await restaurantRabbitMqClient.produce(
                { id, name, price, period, description, features, popular },
                operation
            )) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.log('Error in addNewSubScriptionPlan:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getAllSubscriptionPlans = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const operation = 'Get-All-Subscription-Plan';
            const response: Message = (await restaurantRabbitMqClient.produce({}, operation)) as Message;
            // console.log('Response from RabbitMQ:', response);
            res.status(200).json(response);
        } catch (error) {
            console.log('Error in getAllSubscriptionPlans:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    editSubscriptionPlans = async (req: Request, res: Response, next: NextFunction) => {
        // console.log(req.body, '-------', req.params);
        try {
            const { id } = req.params
            const { name, price, period, description, features, popular } = req.body
            const operation = 'Edit-Subscription-Plan'
            const response: Message = (await restaurantRabbitMqClient.produce(
                {
                    id,
                    name,
                    price,
                    description,
                    period,
                    features,
                    popular
                }, operation)) as Message
            res.status(200).json({ plan: response });
        } catch (error) {
            console.log('Error in editSubscriptionPlans:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    deleteSubscriptionPlans = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const operation = 'Delete-SubScription-Plan'
            const response: Message = (await restaurantRabbitMqClient.produce({ id }, operation)) as Message
            res.status(200).json(response)

        } catch (error) {
            console.log('Error in deleteSubscriptionPlans:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getAllPaymentsOnRestaurants = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const operation = 'Get-All-Restaurant-Payments'
            const response: Message = (await restaurantRabbitMqClient.produce({}, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('Error in get all payemnts on restaurant:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}