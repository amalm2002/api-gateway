
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

    getAnySubscriptionPlanExist = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const operation = 'Get-Any-Plan-Exist'
            const response: Message = (await restaurantRabbitMqClient.produce({ restaurantId: req.params },
                operation
            )) as Message

            res.status(200).json(response)

        } catch (error) {
            console.log('error on get any subscription plan exist side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    paymentForSubscriptionPlan = async (req: Request, res: Response, next: NextFunction) => {
        // console.log('sdfvbnm,.', req.body);
        try {
            const { amount, planId, restaurantId } = req.body
            const operation = 'Subscription-Payment'
            const response: Message = (await restaurantRabbitMqClient.produce(
                {
                    amount,
                    planId, restaurantId
                }, operation)) as Message

            // console.log('resposeeeeeeeeeeeee :', response);

            res.status(200).json(response)

        } catch (error) {
            console.log('error on payment subscription plan side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    veryfiyPaymentForSubscriptionPlan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log('Verify-Payment bodyyyyyyyyy :', req.body);
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                planId,
                restaurantId } = req.body

            const operation = 'Verify-Payment'

            const response: Message = (await restaurantRabbitMqClient.produce({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature, planId,
                restaurantId
            }, operation)) as Message
            res.status(200).json(response)

        } catch (error) {
            console.log('error on payment verification  side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    handleFailedPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, error_code, error_description, planId, restaurantId } = req.body;

            const operation = 'Handle-Failed-Payment';

            const response: Message = (await restaurantRabbitMqClient.produce(
                {
                    razorpay_order_id,
                    razorpay_payment_id,
                    error_code,
                    error_description,
                    planId,
                    restaurantId,
                },
                operation
            )) as Message;

            res.status(200).json(response);
        } catch (error) {
            console.error('Error handling failed payment:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    retryPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const operation = 'Retry-Payment';
            const response: Message = (await restaurantRabbitMqClient.produce(
                { paymentId: id, planId: id },
                operation
            )) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error on retry payment:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    getTheTransactionHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log(req.params, '===================');
            const operation = 'Get-The-Transaction-History'
            const response: Message = (await restaurantRabbitMqClient.produce({ restaurantId: req.params.id },
                operation
            )) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('error on get the tarnsaction history side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    getTheTransactionDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const operation = 'Get-Transaction-Details'
            const response: Message = (await restaurantRabbitMqClient.produce({ transactionId: req.params.id },
                operation
            )) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('error on get the tarnsaction details side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

}