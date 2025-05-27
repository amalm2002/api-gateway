
import { Channel } from 'amqplib';
import rabbitmqConfig from '../../../config/rabbitmq.config';
import { randomUUID } from 'crypto';
import EventEmitter from "events";

export default class Producer {
    constructor(
        private channel: Channel,
        private replyQueueName: string,
        private eventEmitter: EventEmitter
    ) { }

    async produceMessage(data: any, operation: any) {
        try {
            console.log(this.replyQueueName, 'replyQueueName for deliveryBoy...');

            const uuid = randomUUID();

            this.channel.sendToQueue(
                rabbitmqConfig.queues.deliveryBoyQueue,
                Buffer.from(JSON.stringify(data)),
                {
                    replyTo: this.replyQueueName,
                    correlationId: uuid,
                    expiration: 10000,
                    headers: {
                        function: operation
                    }
                }
            );

            console.log('Message sent to queue');

            return new Promise((res, rej) => {
                this.eventEmitter.once(uuid, async (reply) => {
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
