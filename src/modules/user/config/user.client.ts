import path from 'path'
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import 'dotenv/config'

// const packageDef=protoLoader.loadSync(path.resolve(__dirname,'./user.proto'))
// const grpcObject=(grpc.loadPackageDefinition(packageDef)as unknown)as any
// const DOMAIN=process.env.NODE_ENV==='dev'? process.env.DEV_DOMAIN:process.env.PRO_DOMAIN_USER
// console.log(`${DOMAIN}:${process.env.USER_GRPC_PORT}`)
// const UserService=new grpcObject.user_package.UserService(
//     `${DOMAIN}:${process.env.USER_GRPC_PORT}`,grpc.credentials.createInsecure()
// )

// Load proto
const packageDef = protoLoader.loadSync(path.resolve(__dirname, './user.proto'));
const grpcObject = (grpc.loadPackageDefinition(packageDef) as unknown) as any;

// Use the Kubernetes service name directly
const DOMAIN = process.env.USER_GRPC_HOST || 'user-service';
const PORT = process.env.USER_GRPC_PORT || '3003';

console.log(`Connecting to UserService at ${DOMAIN}:${PORT}`);

const UserService = new grpcObject.user_package.UserService(
    `${DOMAIN}:${PORT}`,
    grpc.credentials.createInsecure()
);

export { UserService }       