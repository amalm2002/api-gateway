import path from 'path'
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import 'dotenv/config'

const packageDef=protoLoader.loadSync(path.resolve(__dirname,'./user.proto'))
// console.log('packageDef =======',packageDef);

const grpcObject=(grpc.loadPackageDefinition(packageDef)as unknown)as any

// console.log('grpc object ==', grpcObject);


const DOMAIN=process.env.NODE_ENV==='dev'? process.env.DEV_DOMAIN:process.env.PRO_DOMAIN_USER

// console.log('domain ---',DOMAIN);


const UserService=new grpcObject.user_package.UserService(
    `${DOMAIN}:${process.env.USER_GRPC_PORT}`,grpc.credentials.createInsecure()
)

export {UserService}       