import { Request, Response, NextFunction } from 'express'
import restaurantRabbitMqClient from '../rabbitmq/client'
import { AuthResponse, Message } from '../../../interfaces/interface'

export default class restaurantAuthController {

    checkRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {           
            const { email, mobile } = req.body
            const operation = 'Registration-check'
            const response: Message = (await restaurantRabbitMqClient.produce(
                { email, mobile },
                operation
            )) as Message

            res.status(200).json(response)

        } catch (error: any) {
            console.log(error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }

    registration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log('getting the data on register function...', req.body);

            const operation = 'Restaurant-register'

            const response: Message = (await restaurantRabbitMqClient.produce(
                { ...req.body.formData, otp: req.body.otp, otpToken: req.body.otpToken },
                operation
            )) as Message
            res.status(200).json(response)

        } catch (error) {
            console.log('error while show on registration side :', error);
            res.status(500).json({ error: (error as Error).message })

        }
    }

    resendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {

            console.log('getting the data on resend otp function inside :', req.body);

            const operation = 'Restaurant-resendOtp'

            const response: Message = (await restaurantRabbitMqClient.produce(
                { ...req.body.formData },
                operation
            )) as Message

            res.status(200).json(response)
            console.log('RESPONE RESEND OTP :', response);

        } catch (error) {
            console.log('error while show on resend otp side :', error);
            res.status(500).json({ error: (error as Error).message })

        }
    }

    checkLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // console.log('get the data on api-gateway :', req.body);
            const { email, mobile } = req.body
            const operation = 'Registration-login'
            const response: Message = (await restaurantRabbitMqClient.produce(
                { email, mobile },
                operation
            )) as Message
            res.status(200).json(response)

        } catch (error) {
            console.log('error on check-Login restaurant', error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }

    updateOnlineStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            // console.log('getting the data on apigateway.....', req.body);
            const { token, restaurant_id, isOnline } = req.body
            const operation = 'Update-Online-Status'
            const response: Message = (await restaurantRabbitMqClient.produce(
                { token, restaurant_id, isOnline },
                operation
            )) as Message
            // console.log('response on the online-update-status :', response)
            res.status(200).json(response)

        } catch (error) {
            console.log('error on update-online-status restaurant', error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }

    fetchOnlineStatus=async (req:Request,res:Response,next:NextFunction):Promise <void> => {
        try {
            const restaurantId=req.params.id
            const operation='Fetch-Online-Status'
            const response: Message = (await restaurantRabbitMqClient.produce(
                restaurantId,
                operation
            )) as Message
            // console.log('response on the fetch-Online-status :', response)
            res.status(200).json(response)
            
        } catch (error) {
            console.log('error on fetch-online-status restaurant', error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }

    documentSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { restaurant_id, idProofUrl, fssaiLicenseUrl, businessCertificateUrl, bankAccountNumber, ifscCode } = req.body

            const operation = 'Restaurant-Documents-Submission';

            const response: Message = (await restaurantRabbitMqClient.produce(
                {
                    restaurant_id,
                    idProofUrl,
                    fssaiLicenseUrl,
                    businessCertificateUrl,
                    bankAccountNumber,
                    ifscCode
                },
                operation
            )) as Message;

            res.status(200).json(response)

        } catch (error) {
            console.log('error on document submission side restaurant', error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }

    restaurantLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log('data is getting on the api-gateway :', req.query);

            const operation = 'Restaurant-location'
            const response: Message = (await restaurantRabbitMqClient.produce({
                ...req.body, ...req.query
            }, operation)) as Message

            res.status(200).json(response)

        } catch (error) {
            console.log('error on restaurnt location side restaurant', error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }

    resubmitRestaurantDocuments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log('ethiiiiiiiiiii :', req.body);
            const { restaurantId, idProof, fssaiLicense, businessCertificate, bankAccountNumber, ifscCode } = req.body
            const operation = 'Restaurant-Documents-Re-Submission'
            const response: Message = (await restaurantRabbitMqClient.produce({
                restaurantId,
                idProof,
                fssaiLicense,
                businessCertificate,
                bankAccountNumber,
                ifscCode
            }, operation)) as Message

            // console.log('RESPONSEEEEEEEEEEE',response)
            res.status(200).json(response)  

        } catch (error) {
            console.log('error on document re-submission side restaurant', error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }
}