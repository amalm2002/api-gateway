
import { Request, Response, NextFunction } from 'express'
import deliveryBoyRabbitMqClient from '../rabbitMq/client'
import { AuthResponse, Message } from '../../../interfaces/interface'
import uploadToS3, { deleteFromS3 } from '../../../services/s3bucket'

export default class authenticationController {

    rigister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { mobile } = req.body
            const operation = 'Delivery-Boy-Register'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ mobile }, operation)) as Message
            res.status(200).json(response)
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    deliveryBoyLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const operation = 'Delivery-Boy-location'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({
                ...req.body, ...req.query
            }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('error on restaurnt location side restaurant', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    updateDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const data = { ...req.body };

            const panCardImages = [];
            if (files['panCard[images][0]']) {
                const url = await uploadToS3(files['panCard[images][0]'][0]);
                panCardImages.push(url);
            }
            if (files['panCard[images][1]']) {
                const url = await uploadToS3(files['panCard[images][1]'][0]);
                panCardImages.push(url);
            }
            if (panCardImages.length > 0) {
                data['panCard'] = { ...data['panCard'], images: panCardImages };
            }

            const licenseImages = [];
            if (files['license[images][0]']) {
                const url = await uploadToS3(files['license[images][0]'][0]);
                licenseImages.push(url);
            }
            if (files['license[images][1]']) {
                const url = await uploadToS3(files['license[images][1]'][0]);
                licenseImages.push(url);
            }
            if (licenseImages.length > 0) {
                data['license'] = { ...data['license'], images: licenseImages };
            }

            if (files['profileImage']) {
                const url = await uploadToS3(files['profileImage'][0]);
                data['profileImage'] = url;
            }
            const operation = 'Delivery-Boy-Details';
            const response: Message = (await deliveryBoyRabbitMqClient.produce(
                { ...data, ...req.query },
                operation
            )) as Message;

            res.status(200).json(response);
        } catch (error) {
            console.error('Error in delivery boy details update:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    updateVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const operation = 'Delivery-Boy-Vehicle';
            const response: Message = (await deliveryBoyRabbitMqClient.produce({
                ...req.body, ...req.query
            }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.log('error on delivery boy vehicle update', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    getZones = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const operation = 'Fetch-Delivery-Boy-Zone'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({}, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    updateZone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const operation = 'Delivery-Boy-Zone';
            const response: Message = (await deliveryBoyRabbitMqClient.produce({
                ...req.body, ...req.query
            }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.log('error on delivery boy zone update', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    getResubmitedDocs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const operation = 'Get-Rejected-Documents'
            const response: Message = (await deliveryBoyRabbitMqClient.produce({ id }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('error on get delivery boy resubmit document', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async reSubmittedDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const data: any = { deliveryBoyId: req.body.deliveryBoyId };

            if (req.body.name) {
                data.name = req.body.name;
            }
            const panCardImages = [];
            if (files['panCard[images][0]']) {
                const url = await uploadToS3(files['panCard[images][0]'][0]);
                panCardImages.push(url);
            }
            if (files['panCard[images][1]']) {
                const url = await uploadToS3(files['panCard[images][1]'][0]);
                panCardImages.push(url);
            }
            if (req.body['panCard[number]'] || panCardImages.length > 0) {
                data.panCard = {};
                if (req.body['panCard[number]']) {
                    data.panCard.number = req.body['panCard[number]'];
                }
                if (panCardImages.length > 0) {
                    data.panCard.images = panCardImages;
                }
            }

            const licenseImages = [];
            if (files['license[images][0]']) {
                const url = await uploadToS3(files['license[images][0]'][0]);
                licenseImages.push(url);
            }
            if (files['license[images][1]']) {
                const url = await uploadToS3(files['license[images][1]'][0]);
                licenseImages.push(url);
            }
            if (req.body['license[number]'] || licenseImages.length > 0) {
                data.license = {};
                if (req.body['license[number]']) {
                    data.license.number = req.body['license[number]'];
                }
                if (licenseImages.length > 0) {
                    data.license.images = licenseImages;
                }
            }

            if (req.body['bankDetails[accountNumber]'] || req.body['bankDetails[ifscCode]']) {
                data.bankDetails = {};
                if (req.body['bankDetails[accountNumber]']) {
                    data.bankDetails.accountNumber = req.body['bankDetails[accountNumber]'];
                }
                if (req.body['bankDetails[ifscCode]']) {
                    data.bankDetails.ifscCode = req.body['bankDetails[ifscCode]'];
                }
            }

            if (files['profileImage']) {
                const url = await uploadToS3(files['profileImage'][0]);
                data.profileImage = url;
            }
            const operation = 'Delivery-Boy-Resubmit';
            const response: Message = (await deliveryBoyRabbitMqClient.produce(data, operation)) as Message;

            res.status(200).json(response);
        } catch (error) {
            console.error('Error in delivery boy resubmit docs update:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

}