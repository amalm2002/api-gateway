import path from 'path'
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import 'dotenv/config'

const packageDef=protoLoader.loadSync(path.resolve(__dirname,'./user.proto'))
const grpcObject=(grpc.loadPackageDefinition(packageDef)as unknown)as any
const DOMAIN=process.env.NODE_ENV==='dev'? process.env.DEV_DOMAIN:process.env.PRO_DOMAIN_USER
console.log(`${DOMAIN}:${process.env.USER_GRPC_PORT}`)
const UserService=new grpcObject.user_package.UserService(
    `${DOMAIN}:${process.env.USER_GRPC_PORT}`,grpc.credentials.createInsecure()
)

UserService.waitForReady(Date.now() + 10000, (error:any) => {
  if (error) {
    console.error('Failed to connect to gRPC service:', error);
    console.error('Domain:', DOMAIN);
  } else {
    console.log('Successfully connected to gRPC service');
  }
});

export {UserService}       