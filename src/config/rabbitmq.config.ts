import 'dotenv/config'

export default {
    rabbitMQ: {
        url: String(process.env.RABBITMQ_URL)
    },
    queues: {
        restaurantQueue: 'restaurant_queue',
        deliveryBoyQueue: 'deliveryBoy_queue',
        orderServiceQueue: 'order_service_queue'
    }
}