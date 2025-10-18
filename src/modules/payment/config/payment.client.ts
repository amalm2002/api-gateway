import path from 'path'
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import 'dotenv/config'


// const packageDef = protoLoader.loadSync(path.resolve(__dirname, './payment.proto'))
// const grpcObject = (grpc.loadPackageDefinition(packageDef) as unknown) as any
// const DOMAIN = process.env.NODE_ENV === 'dev' ? process.env.DEV_DOMAIN : process.env.PRO_DOMAIN_PAYMENT
// const PaymentService=new grpcObject.payment_package.PaymentService(
//     `${DOMAIN}:${process.env.PAYMENT_GRPC_PORT}`,grpc.credentials.createInsecure()
// )

// Load proto
const packageDef = protoLoader.loadSync(path.resolve(__dirname, './payment.proto'))
const grpcObject = (grpc.loadPackageDefinition(packageDef) as unknown) as any

// Use the Kubernetes service name directly
const DOMAIN = process.env.PAYMENT_GRPC_HOST || 'payment-service';
const PORT = process.env.PAYMENT_GRPC_PORT || '3008';

console.log(`Connecting to PaymentService at ${DOMAIN}:${PORT}`);

const PaymentService = new grpcObject.payment_package.PaymentService(
    `${DOMAIN}:${PORT}`,
    grpc.credentials.createInsecure()
);

export {PaymentService}   