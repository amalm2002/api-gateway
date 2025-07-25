import path from 'path'
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import 'dotenv/config'

const packageDef=protoLoader.loadSync(path.resolve(__dirname,'./user.proto'))
const grpcObject=(grpc.loadPackageDefinition(packageDef)as unknown)as any
const DOMAIN=process.env.NODE_ENV==='dev'? process.env.DEV_DOMAIN:process.env.PRO_DOMAIN_USER
const UserService=new grpcObject.user_package.UserService(
    `${DOMAIN}:${process.env.USER_GRPC_PORT}`,grpc.credentials.createInsecure()
)

export {UserService}       