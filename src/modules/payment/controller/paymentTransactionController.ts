import { Request, Response } from "express";
import { PaymentService } from "../config/payment.client";


export default class paymentTransactionController {
    PlaceOrderPayment = async (req: Request, res: Response) => {
        try {
            PaymentService.PlaceOrder({
                ...req.body
            }, (err: any, result: { message: string, orderId: string, paymentId: string, success: boolean }) => {
                if (err) {
                    res.status(400).json({ message: result.message });
                } else {
                    res.status(200).json({
                        message: result.message,
                        orderId: result.orderId,
                        paymentId: result.paymentId,
                        success: result.success
                    });
                }
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    CreateOrderPayment = async (req: Request, res: Response) => {
        try {
            PaymentService.CreateOrderPayment({
                ...req.body
            }, (err: any, result: { message: string; orderId: string; razorpayKey: string, error: string, paymentDbId: string }) => {
                if (err) {
                    res.status(400).json({ message: result.message });
                } else {
                    console.log('create response :', result);
                    res.status(200).json({
                        error: result.error,
                        orderId: result.orderId,
                        razorpayKey: result.razorpayKey,
                        paymentDbId: result.paymentDbId
                    });
                }
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    VerifyUpiPayment = async (req: Request, res: Response) => {
        try {
            const {
                paymentDbId,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                orderData
            } = req.body;

            PaymentService.VerifyUpiPayment({
                paymentIdDB: paymentDbId,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                orderData: {
                    userId: orderData.userId,
                    subtotal: orderData.subtotal,
                    deliveryFee: orderData.deliveryFee,
                    tax: orderData.tax,
                    total: orderData.total,
                    address: orderData.address,
                    phoneNumber: orderData.phoneNumber,
                    paymentMethod: orderData.paymentMethod,
                    paymentId: orderData.paymentId,
                    location: {
                        latitude: orderData.location.latitude,
                        longitude: orderData.location.longitude
                    },
                    cartItems: orderData.cartItems.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        quantity: item.quantity,
                        images: item.images,
                        restaurantId: item.restaurantId,
                        restaurant: item.restaurant,
                        category: item.category,
                        discount: item.discount,
                        timing: item.timing,
                        rating: item.rating,
                        hasVariants: item.hasVariants,
                        variants: item.variants,
                        maxAvailableQty: item.maxAvailableQty
                    }))
                }
            }, (err: any, result: { message: string, orderId: string, success: boolean }) => {
                if (err) {
                    res.status(400).json({ message: err.message || "Something went wrong" });
                } else {
                    console.log('verify order response :', result);
                    res.status(200).json(result);
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    CreateDeliveryBoyPayment = async (req: Request, res: Response) => {
        const { deliveryBoyId, amount } = req.body
        try {
            PaymentService.CreateDeliveryBoyPayment({
                deliveryBoyId, amount
            }, (err: any, result: { message: string, orderId: string; razorpayKey: string, error: string, }) => {
                if (err) {
                    res.status(400).json({ message: result.message });
                } else {
                    console.log('create response :', result);
                    res.status(200).json({
                        error: result.error,
                        orderId: result.orderId,
                        razorpayKey: result.razorpayKey,
                    });
                }
            })
        } catch (error) {

        }
    }

    VerifyDeliveryBoyPayment = async (req: Request, res: Response) => {
        const { deliveryBoyId,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature } = req.body

        try {
            PaymentService.VerifyDeliveryBoyPayment({
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                deliveryBoyId

            }, (err: any, result: { message: string, orderId: string, success: boolean }) => {
                if (err) {
                    res.status(400).json({ message: err.message || "Something went wrong" });
                } else {
                    console.log('verify delivery-boy payment response :', result);
                    res.status(200).json(result);
                }
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    CancelDeliveryBoyPayment = async (req: Request, res: Response) => {
        const { deliveryBoyId, orderId } = req.body;
        try {
            PaymentService.CancelDeliveryBoyPayment({ deliveryBoyId, orderId }, (err: any, result: { message: string; success: boolean }) => {
                if (err) {
                    res.status(400).json({ message: err.message || 'Failed to cancel payment' });
                } else {
                    res.status(200).json(result);
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

}