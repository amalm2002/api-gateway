import winston from "winston";
import morgan from "morgan";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { Client } from "@elastic/elasticsearch";

const esClient = new Client({
  node: "http://elasticsearch:9200", 
});

const esTransport = new ElasticsearchTransport({
  level: "info",
  client: esClient as any,
  indexPrefix: "api-gateway-logs",
  transformer: (logData: any) => ({
    "@timestamp": new Date().toISOString(),
    severity: logData.level,
    message: logData.message,
    meta: logData.meta || {},
  }),
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    esTransport,
  ],
});

const morganMiddleware = morgan("combined", {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
});

export { logger, morganMiddleware };
