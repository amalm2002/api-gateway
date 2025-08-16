import { Request, Response, NextFunction } from 'express';
import deliveryBoyRabbitMqClient from '../rabbitMq/client';
import { Message } from '../../../interfaces/interface';
import OrderController from '../../order/controller/orderController';
import orderRabbitMqClient from '../../order/rabbitmq/client';



export default class DeliveryPartnerController {

  private orderController: OrderController

  constructor() {
    this.orderController = new OrderController()
  }

  async enableTheOnlineOption(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryBoyId = req.params.id;
      const { isOnline } = req.body;
      const operation = 'Partner-Enable-Online-Status';
      const response: Message = (await deliveryBoyRabbitMqClient.produce(
        { deliveryBoyId, isOnline },
        operation
      )) as Message;
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in enableTheOnlineOption:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  async getDeliveryBoyDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryBoyId = req.params.id;
      const operation = 'Get-Delivery-Boy-Details';
      const response: Message = (await deliveryBoyRabbitMqClient.produce(
        { deliveryBoyId },
        operation
      )) as Message;
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getDeliveryBoyDetails:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  async findNearestDeliveryPartner(data: any) {
    try {
      const { location } = data;
      if (!location || !location.latitude || !location.longitude) {
        return { success: false, message: 'Invalid restaurant location' };
      }

      const operation = 'Find-The-Nearest-Delivery-Partner';
      const response: Message = (await deliveryBoyRabbitMqClient.produce(
        { location },
        operation
      )) as Message;
      return response;
    } catch (error) {
      console.error('Error in findNearestDeliveryPartner:', error);
      return { success: false, message: 'Internal Server Error' };
    }
  }

  async updateLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryBoyId = req.params.id;
      const { latitude, longitude } = req.body;
      const operation = 'Delivery-Boy-Location-Update';
      const response: Message = (await deliveryBoyRabbitMqClient.produce(
        { deliveryBoyId, latitude, longitude },
        operation
      )) as Message;
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in updateLocation:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async assignOrderOnDeliveryPartner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, deliveryBoyId } = req.body;
      const checkOrderOperation = 'Get-Order-Detail';
      const orderResponse: Message = (await orderRabbitMqClient.produce(
        { orderId, deliveryBoyId },
        checkOrderOperation
      )) as Message;
      res.status(200).json({ success: true, message: 'Order assigned successfully' });
    } catch (error) {
      console.error('Error in assignOrderOnDeliveryPartner:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async updateDeliveryLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { deliveryBoyId, latitude, longitude } = req.body;
      if (!deliveryBoyId || typeof latitude !== 'number' || typeof longitude !== 'number') {
        res.status(400).json({ success: false, message: 'Invalid request: deliveryBoyId, latitude, and longitude are required' });
        return
      }
      const operation = 'Update-Delivery-Boy-Location';
      const response: Message = (await deliveryBoyRabbitMqClient.produce(
        { deliveryBoyId, latitude, longitude },
        operation
      )) as Message;
      console.log('Update delivery boy location response:', JSON.stringify(response, null, 2));
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in update-delivery-boy-location:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async completeDelivery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, deliveryBoyId } = req.body;

      if (!orderId || !deliveryBoyId) {
        res.status(400).json({ success: false, message: 'orderId and deliveryBoyId are required' });
        return;
      }

      // 1: Update order status to Delivered
      const orderOperation = 'Complete-Delivery';
      const orderResponse: Message = (await orderRabbitMqClient.produce(
        { orderId },
        orderOperation
      )) as Message;

      if (!orderResponse.success) {
        res.status(400).json({ success: false, message: orderResponse.message || 'Failed to update order status' });
        return;
      }

      // 2: Update delivery boy (set pendingOrders to 0, increment ordersCompleted)
      const deliveryBoyOperation = 'Complete-Delivery';
      const deliveryBoyResponse: Message = (await deliveryBoyRabbitMqClient.produce(
        { orderId, deliveryBoyId },
        deliveryBoyOperation
      )) as Message;

      if (!deliveryBoyResponse.success) {
        // rollback order status to previous state
        const rollbackResponse: Message = (await orderRabbitMqClient.produce(
          { orderId, orderStatus: 'Picked' },
          'Change-Order-Status'
        )) as Message;

        res.status(400).json({
          success: false,
          message: deliveryBoyResponse.message || 'Failed to update delivery boy',
        });
        return;
      }

      res.status(200).json({ success: true, message: 'Delivery completed successfully' });
    } catch (error) {
      console.error('Error in completeDelivery:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async orderEarnings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { paymentMethod, deliveryBoyId, finalTotalDistance, orderAmount, order_id } = req.body
      const operation = 'Order-Earnings';
      const response: Message = (await deliveryBoyRabbitMqClient.produce({
        paymentMethod,
        deliveryBoyId,
        finalTotalDistance,
        orderAmount,
        order_id
      }, operation)) as Message;
      res.status(200).json(response)
    } catch (error) {
      console.error('Error in orderEarings:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async checkTheInHandCash(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { deliveryBoyId } = req.body;
      const operation = 'Check-In-Hand-Cash-Limit';
      const response: Message = (await deliveryBoyRabbitMqClient.produce({ deliveryBoyId }, operation)) as Message;
      res.status(200).json(response)
    } catch (error) {
      console.error('Error in checkInHandCash on delivery partner:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async userReviewFordeliveryBoy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { deliveryBoyId, rating, comment, orderId, userId, isEdit, userName } = req.body
      const operation = 'User-Review-For-Delivery-Boy'
      const response: Message = (await deliveryBoyRabbitMqClient.produce({
        deliveryBoyId,
        rating,
        comment,
        orderId,
        userId,
        isEdit,
        userName
      }, operation)) as Message
      res.status(200).json(response)
    } catch (error) {
      console.error('Error in submiting the review on delivery boy:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async getTheDeliveryBoyreview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, orderId, deliveryBoyId } = req.query
      const operation = 'Get-The-DeliveryBoy-Review'
      const response: Message = (await deliveryBoyRabbitMqClient.produce({
        userId,
        orderId,
        deliveryBoyId
      }, operation)) as Message;
      res.status(200).json(response)
    } catch (error) {
      console.error('Error in getting the review on delivery boy:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async deleteUserReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, orderId, deliveryBoyId } = req.query
      const operation = 'Delete-DeliveryBoy-Review'
      const response: Message = (await deliveryBoyRabbitMqClient.produce({
        userId,
        orderId,
        deliveryBoyId
      }, operation)) as Message;
      res.status(200).json(response)
    } catch (error) {
      console.error('Error in delete the review on delivery boy:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
}