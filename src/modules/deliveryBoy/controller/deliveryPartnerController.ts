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
      const id = deliveryBoyId
      const operation = 'Assign-Delivery-Boy';
      const fetchDeliveryBoyOperation = 'Fetch-The-Delivery-Boy-Deatils';
      const checkOrderOperation = 'Get-Order-Details';

      const orderResponse: Message = (await orderRabbitMqClient.produce(
        { orderId },
        checkOrderOperation
      )) as Message;

      if (!orderResponse.success || !orderResponse.data) {
        res.status(400).json({ success: false, message: 'Order not found' });
        return
      }

      if (orderResponse.data.deliveryBoy?.id) {
        res.status(400).json({ success: false, message: 'Order already assigned to another delivery boy' });
        return
      }

      if (!['Preparing', 'Pending'].includes(orderResponse.data.orderStatus)) {
        res.status(400).json({ success: false, message: 'Order cannot be assigned in current status' });
        return
      }

      const deliveryBoyResponse: Message = (await deliveryBoyRabbitMqClient.produce(
        { id },
        fetchDeliveryBoyOperation
      )) as Message;

      // console.log('delivery boy response :', deliveryBoyResponse);

      if (!deliveryBoyResponse.response) {
        res.status(400).json({ success: false, message: 'Delivery boy not found' });
        return
      }

      const { name, mobile, profileImage } = deliveryBoyResponse.response;


      const orderAssignResponse: Message = (await orderRabbitMqClient.produce(
        { orderId, deliveryBoyId, deliveryBoyName: name, mobile, profileImage },
        operation
      )) as Message;

      if (!orderAssignResponse.success) {
        res.status(400).json({ success: false, message: orderAssignResponse.message });
        return
      }


      const deliveryBoyUpdate: Message = (await deliveryBoyRabbitMqClient.produce(
        { orderId, deliveryBoyId },
        operation
      )) as Message;

      if (deliveryBoyUpdate.status !== 'success') {

        const rollbackResponse: Message = (await orderRabbitMqClient.produce(
          { orderId, deliveryBoy: null },
          'Remove-Delivery-Boy'
        )) as Message;

        res.status(400).json({ success: false, message: deliveryBoyUpdate.message || 'Failed to update delivery boy' });
        return;
      }

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

      // Step 1: Update order status to Delivered
      const orderOperation = 'Complete-Delivery';
      const orderResponse: Message = (await orderRabbitMqClient.produce(
        { orderId },
        orderOperation
      )) as Message;

      if (!orderResponse.success) {
        res.status(400).json({ success: false, message: orderResponse.message || 'Failed to update order status' });
        return;
      }

      // Step 2: Update delivery boy (set pendingOrders to 0, increment ordersCompleted)
      const deliveryBoyOperation = 'Complete-Delivery';
      const deliveryBoyResponse: Message = (await deliveryBoyRabbitMqClient.produce(
        { orderId, deliveryBoyId },
        deliveryBoyOperation
      )) as Message;

      if (!deliveryBoyResponse.success) {
        // Rollback order status to previous state (e.g., Picked)
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
}