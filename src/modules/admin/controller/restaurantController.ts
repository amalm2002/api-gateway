import { Response, Request, NextFunction } from "express";
import restaurantRabbitMqClient from '../../restaurant/rabbitmq/client'
import { Message } from "../../../interfaces/interface";


export default class restaurantController {

    getAllRestaurants = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const operation = 'Get-All-Restaurants'
            const response: Message = (await restaurantRabbitMqClient.produce({},
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
            // console.log('RESPONSEEEEEEEEE :',response);

            res.status(200).json(response)
        } catch (error) {
            console.log('the error has to show on the rejected docs side :', error);
            res.status(500).json({ message: 'internal server error' })
        }
    }
}