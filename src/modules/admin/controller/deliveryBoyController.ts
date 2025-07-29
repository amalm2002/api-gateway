
import { Response, Request, NextFunction } from "express";
import deliveryBoyRabbitMqClient from '../../deliveryBoy/rabbitMq/client'
import { Message } from "../../../interfaces/interface";


export default class deliveryBoyController {

    zoneCreation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log('request data :', req.body);

            const operation = 'Zone-Creation'
            const response: Message = (await deliveryBoyRabbitMqClient.produce(
                { ...req.body },
                operation
            )) as Message

            // console.log('RESPONSEEEEEEEE :', response);
            res.status(200).json(response)

        } catch (error: any) {
            console.log(error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }

    fetchZones = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const operation = 'Fetch-Delivery-Boy-Zone'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({}, operation)) as Message
            res.status(200).json(response)

        } catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }

    deleteZone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const operation = 'Delete-Delivery-Boy-Zone'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ id }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }

    fetchDeliveryBoys = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const operation = 'Fetch-All-Delivery-Boys'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({}, operation)) as Message
            console.log('repsone :', response);

            res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }

    updateDeliveryBoyStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            // console.log(req.params, req.body, '++++++');
            const operation = 'Update-The-Delivery-Boy-Status'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ id }, operation)) as Message
            res.status(200).json(response)

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    fetchDeliveryBoyDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            // console.log(req.params, req.body, '++++++');
            const operation = 'Fetch-The-Delivery-Boy-Deatils'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ id }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    verifyDeliveryBoyDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const deliveryBoyId = req.params.id
            const operation = 'Verify-Delivery-Boy-Documents'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({
                deliveryBoyId
            }, operation)) as Message
            res.status(200).json(response)

        } catch (error) {
            console.log('the error has to show on the verify deliveryBoy docs side :', error);
            res.status(500).json({ message: 'internal server error' })
        }
    }

    rejectedDeliveryBoyDocuments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { deliveryBoyId, rejectionReason } = req.body
            const operation = 'Rejected-DeliveryBoy-Documents'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({
                deliveryBoyId, rejectionReason
            }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('the error has to show on the rejected docs side :', error);
            res.status(500).json({ message: 'internal server error' })
        }
    }

    addRidePaymentRule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const operation = 'Add-Ride-Payment-Rule';
            const response: Message = (await deliveryBoyRabbitMqClient.produce({
                ...req.body
            }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.log('the error has to show on the add-ride-payment  side :', error);
            res.status(500).json({ message: 'internal server error' });
        }
    }

    getRideRatePaymentRules = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const operation = 'Get-Ride-Rate-Payment-Rules';
            const response: Message = (await deliveryBoyRabbitMqClient.produce({}, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.log('the error has to show on the get-ride-rate-payment  side :', error);
            res.status(500).json({ message: 'internal server error' });
        }
    }

    async updateRidePaymentRule(req: Request, res: Response, next: NextFunction) {
        try {
            const operation = 'Update-Ride-Payment-Rule';
            const response: Message = (await deliveryBoyRabbitMqClient.produce(
                { id: req.params.id, ...req.body },
                operation
            )) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.log('Error in updateRidePaymentRule:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async blockRidePaymentRule(req: Request, res: Response, next: NextFunction) {
        try {
            const operation = 'Block-Ride-Payment-Rule';
            const response: Message = (await deliveryBoyRabbitMqClient.produce(
                { id: req.params.id, vehicleType: req.body.vehicleType },
                operation
            )) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.log('Error in blockRidePaymentRule:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async unblockRidePaymentRule(req: Request, res: Response, next: NextFunction) {
        try {
            const operation = 'Unblock-Ride-Payment-Rule';
            const response: Message = (await deliveryBoyRabbitMqClient.produce(
                { id: req.params.id },
                operation
            )) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.log('Error in unblockRidePaymentRule:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}