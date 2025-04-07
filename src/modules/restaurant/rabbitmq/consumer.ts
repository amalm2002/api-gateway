import { Channel, ConsumeMessage } from "amqplib";
import EventEmitter from "events";

export default class Consumer {
    constructor(
        private channel: Channel,
        private replyQueueName: string,
        private eventEmitter: EventEmitter
    ) { }

    async consumeMessage() {
        console.log('Starting to consume messages...');

        this.channel.consume(
            this.replyQueueName,
            (message: ConsumeMessage | null) => {
                if (message) {
                    const correlationId = message.properties.correlationId;
                    if (correlationId) {
                        this.eventEmitter.emit(correlationId.toString(), message);
                    } else {
                        console.warn("Received message without correlationId:", message);
                    }
                }
            },
            { noAck: true }
        );
    }
}
