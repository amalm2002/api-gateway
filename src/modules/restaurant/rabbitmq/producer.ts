import { Channel } from 'amqplib';
import rabbitmqConfig from '../../../config/rabbitmq.config';
import { randomUUID } from 'crypto';
import EventEmitter from "events";

export default class Producer {
    constructor(
        private readonly _channel: Channel,
        private readonly _replyQueueName: string,
        private readonly _eventEmitter: EventEmitter
    ) { }

    async produceMessage(data: any, operation: any) {
        try {
            console.log(this._replyQueueName, 'replyQueueName for restaurant...');

            const uuid = randomUUID();

            this._channel.sendToQueue(
                rabbitmqConfig.queues.restaurantQueue,
                Buffer.from(JSON.stringify(data)),
                {
                    replyTo: this._replyQueueName,
                    correlationId: uuid,
                    expiration: 10000,
                    headers: {
                        function: operation
                    }
                }
            );

            console.log('Message sent to queue');

            return new Promise((res, rej) => {
                this._eventEmitter.once(uuid, async (reply) => {
                    try {
                        // console.log('Reply received:', reply);
                        const replyDataString = Buffer.from(reply.content).toString('utf-8');
                        const replyObject = JSON.parse(replyDataString);
                        res(replyObject);
                    } catch (error) {
                        console.error("Error processing reply message:", error);
                        rej(error);
                    }
                });
            });

        } catch (error) {
            console.error('Error on send queue:', error);
        }
    }
}
