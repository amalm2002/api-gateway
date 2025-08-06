
import { Response, Request, NextFunction, query } from "express";
import deliveryBoyRabbitMqClient from '../../deliveryBoy/rabbitMq/client'
import { Message } from "../../../interfaces/interface";


export default class deliveryBoyController {

    async zoneCreation(req: Request, res: Response, next: NextFunction) {
        try {
            const operation = 'Zone-Creation'
            const response: Message = (await deliveryBoyRabbitMqClient.produce(
                { ...req.body },
                operation
            )) as Message
            res.status(200).json(response)
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async fetchZones(req: Request, res: Response, next: NextFunction) {
        try {
            const operation = 'Fetch-Delivery-Boy-Zone'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({}, operation)) as Message
            res.status(200).json(response)

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async deleteZone(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const operation = 'Delete-Delivery-Boy-Zone'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ id }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async fetchDeliveryBoys(req: Request, res: Response, next: NextFunction) {
        try {
            const operation = 'Fetch-All-Delivery-Boys'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({}, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async updateDeliveryBoyStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const operation = 'Update-The-Delivery-Boy-Status'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ id }, operation)) as Message
            res.status(200).json(response)

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async fetchDeliveryBoyDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const operation = 'Fetch-The-Delivery-Boy-Deatils'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ id }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async verifyDeliveryBoyDocuments(req: Request, res: Response, next: NextFunction) {
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

    async rejectedDeliveryBoyDocuments(req: Request, res: Response, next: NextFunction) {
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

    async addRidePaymentRule(req: Request, res: Response, next: NextFunction) {
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

    async getRideRatePaymentRules(req: Request, res: Response, next: NextFunction) {
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

    async addDeliveryBoyHelpOptions(req: Request, res: Response, next: NextFunction) {
        try {
            // console.log('body data :', req.body)
            const { title, description, category, isActive } = req.body
            const operation = 'Add-DeliveryBoy-Help-Options'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({
                title, description, category, isActive
            }, operation)) as Message;
            res.status(200).json(response)
        } catch (error) {
            console.error('this error has to showing on the add help option on delivery partner side', error);
            res.status(500).json({ message: 'Internal error' })
        }
    }

    async updateDeliveryBoyHelpOptions(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { title, description, category, isActive } = req.body;
            const operation = 'Update-DeliveryBoy-Help-Options';
            const response: Message = (await deliveryBoyRabbitMqClient.produce({
                id, title, description, category, isActive
            }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in updateDeliveryBoyHelpOptions:', error);
            res.status(500).json({ message: 'Internal error' });
        }
    };

    async deleteDeliveryBoyHelpOptions(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const operation = 'Delete-DeliveryBoy-Help-Options';
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ id }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in deleteDeliveryBoyHelpOptions:', error);
            res.status(500).json({ message: 'Internal error' });
        }
    };

    async getAllDeliveryBoyHelpOptions(req: Request, res: Response, next: NextFunction) {
        try {
            const operation = 'Get-All-DeliveryBoy-Help-Options';
            const response: Message = (await deliveryBoyRabbitMqClient.produce({}, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in getAllDeliveryBoyHelpOptions:', error);
            res.status(500).json({ message: 'Internal error' });
        }
    }

    async getChatState(req: Request, res: Response, next: NextFunction) {
        try {
            const deliveryBoyId = req.params.id;
            const operation = 'Get-Chat-State';
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ deliveryBoyId }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in getChatState:', error);
            res.status(500).json({ success: false, message: 'Internal error' });
        }
    }

    async saveChatState(req: Request, res: Response, next: NextFunction) {
        try {
            const deliveryBoyId = req.params.id;
            const state = req.body;
            const operation = 'Save-Chat-State';
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ deliveryBoyId, state }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in saveChatState:', error);
            res.status(500).json({ success: false, message: 'Internal error' });
        }
    }

    async clearChatState(req: Request, res: Response, next: NextFunction) {
        try {
            const deliveryBoyId = req.params.id;
            const operation = 'Clear-Chat-State';
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ deliveryBoyId }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in clearChatState:', error);
            res.status(500).json({ success: false, message: 'Internal error' });
        }
    }

    async submitConcers(req: Request, res: Response, next: NextFunction) {
        try {
            const { deliveryBoyId, selectedOption, reason, description } = req.body;
            const operation = 'Submit-Concern';
            const response: Message = (await deliveryBoyRabbitMqClient.produce(
                {
                    deliveryBoyId,
                    selectedOption,
                    reason,
                    description,
                },
                operation
            )) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in submitConcers:', error);
            res.status(500).json({ success: false, message: 'Internal error' });
        }
    }

    async submitZoneChangeRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const { deliveryBoyId, concernId, zoneId, zoneName, reason, description } = req.body;
            const operation = 'Submit-Zone-Change';
            const response: Message = (await deliveryBoyRabbitMqClient.produce(
                {
                    deliveryBoyId,
                    concernId,
                    zoneId,
                    zoneName,
                    reason,
                    description,
                },
                operation
            )) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in submitZoneChangeRequest:', error);
            res.status(500).json({ success: false, message: 'Internal error' });
        }
    }

    async getAllConcerns(req: Request, res: Response, next: NextFunction) {
        try {
            const operation = 'Get-All-Concerns'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({}, operation)) as Message;
            res.status(200).json(response)
        } catch (error) {
            console.error('Error in get all concerns:', error);
            res.status(500).json({ success: false, message: 'Internal error' });
        }
    }

    async verifyTheConcern(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, newStatus, rejectionReason } = req.body;
            const operation = 'Verify-Concern'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ id, newStatus, rejectionReason }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.error('Error in verify concern side:', error);
            res.status(500).json({ success: false, message: 'Internal error' });
        }
    }

    async getConcerns(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('deee :', req.query);
            const deliveryBoyId = req.query.deliveryBoyId
            const operation = 'Get-The-Delivery-Boy-Concern-Result'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ deliveryBoyId }, operation)) as Message;
            res.status(200).json(response)
        } catch (error) {
            console.error('Error in get concern side:', error);
            res.status(500).json({ success: false, message: 'Internal error' });
        }
    }
}