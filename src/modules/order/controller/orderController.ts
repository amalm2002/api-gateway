import { Request, Response, NextFunction } from 'express';
import { Message } from '../../../interfaces/interface';
import orderServiceRabbitMqClient from '../rabbitmq/client';
import WalletController from '../../user/controllers/walletController';
import MenuController from '../../restaurant/controller/menuController';



export default class OrderController {

    constructor(
        private readonly _walletController: WalletController,
        private readonly _menuController: MenuController
    ) { }

    getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const restaurantId = req.params.id
            // const operation = 'Get-All-Restaurant-Orders'
            // const response: Message = (await orderServiceRabbitMqClient.produce({
            //     restaurantId
            // }, operation)) as Message
            // res.status(200).json(response);
            const restaurantId = req.params.id;
            const {
                page = '1',
                limit = '10',
                statusFilter = 'all',
                searchTerm = '',
                sortField = 'createdAt',
                sortDirection = 'desc',
            } = req.query;
            const operation = 'Get-All-Restaurant-Orders';
            const response: Message = (await orderServiceRabbitMqClient.produce(
                {
                    restaurantId,
                    page: parseInt(page as string, 10),
                    limit: parseInt(limit as string, 10),
                    statusFilter: statusFilter as string,
                    searchTerm: searchTerm as string,
                    sortField: sortField as string,
                    sortDirection: sortDirection as 'asc' | 'desc',
                },
                operation
            )) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in get-order:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    fetchDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { restaurantId } = req.params;
            const { period, startDate, endDate } = req.query;
            const operation = 'Get-Dashboard-Stats';
            const response = await orderServiceRabbitMqClient.produce(
                {
                    restaurantId,
                    period: period as string,
                    startDate: startDate as string,
                    endDate: endDate as string,
                },
                operation
            );
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in get-dashboard-stats:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const operation = 'Create-Order';
            const response: Message = (await orderServiceRabbitMqClient.produce({
                ...req.body,
            }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in createOrder:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const operation = 'Verify-Payment';
            const response: Message = (await orderServiceRabbitMqClient.produce({
                ...req.body,
            }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in verifyPayment:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    placeOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const operation = 'Place-Order';
            const response: Message = (await orderServiceRabbitMqClient.produce({
                orderData: req.body,
            }, operation)) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.error('Error in placeOrder:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    changeOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderId = req.params.id
            const operation = 'Change-Order-Status'
            const response: Message = (await orderServiceRabbitMqClient.produce({
                orderId, ...req.body
            }, operation)) as Message
            res.status(200).json(response)

        } catch (error) {
            console.error('Error in change-order-status:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    getUsersOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id
            const { page = '1', limit = '10' } = req.query;
            const operation = 'Get-User-Order'
            const response: Message = (await orderServiceRabbitMqClient.produce({
                userId,
                page: parseInt(page as string, 10),
                limit: parseInt(limit as string, 10),
            }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.error('Error in get-user-order:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderId = req.params.id
            const operation = 'Get-Order-Details'
            const response: Message = (await orderServiceRabbitMqClient.produce({
                orderId
            }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.error('Error in get-order-details:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const orderId = req.params.orderId;
            const operation = 'Cancel-Order';
            const response: Message = (await orderServiceRabbitMqClient.produce(
                { orderId },
                operation
            )) as Message;
            if (response.success) {
                const updateMenuQtyResponse = await this._menuController.cancelOrderMenuQuantityUpdate({
                    userId: response.refundData.userId,
                    restaurantId: response.refundData.restaurantId,
                    items: response.refundData.items
                })
            }
            if (response.success && response.refundRequired) {
                const walletResponse = await this._walletController.updateWallet({
                    userId: response.refundData.userId,
                    amount: response.refundData.amount,
                    description: `Refund for order ${orderId}`,
                    type: 'credit',
                });

                if (!walletResponse.success) {
                    console.error('Failed to update wallet:', walletResponse.message);
                    res.status(500).json({ success: false, message: 'Order cancelled but failed to update wallet' });
                    return
                }
            }

            res.status(200).json(response);
        } catch (error) {
            console.error('Error in cancel-order:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };

    verifyOrderNumber = async (req: Request, res: Response) => {
        try {
            const { enteredPin, orderId } = req.body
            const operation = 'Verify-Order-Number'
            const response: Message = (await orderServiceRabbitMqClient.produce(
                {
                    enteredPin, orderId
                }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.error('Error in Verify-Order-Number:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    getDeliveryPartnerOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deliveryBoyId = req.params.id
            const operation = 'Get-Delivery-Partner-Orders'
            const response: Message = (await orderServiceRabbitMqClient.produce({ deliveryBoyId }, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.error('Error in get the delivery partner orders:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }



}