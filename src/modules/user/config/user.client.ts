// import path from 'path'
// import * as grpc from "@grpc/grpc-js";
// import * as protoLoader from "@grpc/proto-loader";
// import 'dotenv/config'

// const packageDef=protoLoader.loadSync(path.resolve(__dirname,'./user.proto'))
// const grpcObject=(grpc.loadPackageDefinition(packageDef)as unknown)as any
// const DOMAIN=process.env.NODE_ENV==='dev'? process.env.DEV_DOMAIN:process.env.PRO_DOMAIN_USER
// console.log(`${DOMAIN}:${process.env.USER_GRPC_PORT}`)
// const UserService=new grpcObject.user_package.UserService(
//     `${DOMAIN}:${process.env.USER_GRPC_PORT}`,grpc.credentials.createInsecure()
// )

// UserService.waitForReady(Date.now() + 10000, (error:any) => {
//   if (error) {
//     console.error('Failed to connect to gRPC service:', error);
//     console.error('Domain:', DOMAIN);
//   } else {
//     console.log('Successfully connected to gRPC service');
//   }
// });

// export {UserService}       


import path from 'path'
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import 'dotenv/config'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, './user.proto'))
const grpcObject = (grpc.loadPackageDefinition(packageDef) as unknown) as any

// Railway gRPC connection configuration
let DOMAIN: string;
let credentials: grpc.ChannelCredentials;

if (process.env.NODE_ENV === 'dev') {
  DOMAIN = `${process.env.DEV_DOMAIN}:${process.env.USER_GRPC_PORT}`;
  credentials = grpc.credentials.createInsecure();
} else {
  // For Railway - try different approaches
  DOMAIN = `${process.env.PRO_DOMAIN_USER}:443`; // Railway typically uses 443
  credentials = grpc.credentials.createSsl(); // Use SSL for Railway
}

console.log(`Attempting to connect to: ${DOMAIN}`);
console.log(`Using credentials: ${process.env.NODE_ENV === 'dev' ? 'Insecure' : 'SSL'}`);

const UserService = new grpcObject.user_package.UserService(DOMAIN, credentials);

// Test connection
UserService.waitForReady(Date.now() + 20000, (error:any) => {
  if (error) {
    console.error('❌ SSL connection failed, trying insecure...');
    
    // Fallback: Try insecure connection
    tryInsecureConnection();
  } else {
    console.log('✅ Connected successfully with SSL');
  }
});

// Fallback function
function tryInsecureConnection() {
  const INSECURE_DOMAIN = `${process.env.PRO_DOMAIN_USER}:443`;
  console.log(`Trying insecure connection to: ${INSECURE_DOMAIN}`);
  
  const InsecureUserService = new grpcObject.user_package.UserService(
    INSECURE_DOMAIN, 
    grpc.credentials.createInsecure()
  );
  
  InsecureUserService.waitForReady(Date.now() + 15000, (error:any) => {
    if (error) {
      console.error('❌ Both SSL and insecure connections failed');
      console.error('Error:', error.message);
      
      // Try without port
      tryWithoutPort();
    } else {
      console.log('✅ Connected successfully with insecure connection');
      // Replace the exported service
      Object.assign(UserService, InsecureUserService);
    }
  });
}

// Try connection without specifying port
function tryWithoutPort() {
  const NO_PORT_DOMAIN = process.env.PRO_DOMAIN_USER; // No port specified
  console.log(`Trying connection without port: ${NO_PORT_DOMAIN}`);
  
  const NoPortUserService = new grpcObject.user_package.UserService(
    NO_PORT_DOMAIN,
    grpc.credentials.createInsecure()
  );
  
  NoPortUserService.waitForReady(Date.now() + 15000, (error:any) => {
    if (error) {
      console.error('❌ All connection attempts failed');
      console.error('Final error:', error.message);
    } else {
      console.log('✅ Connected successfully without port specification');
      Object.assign(UserService, NoPortUserService);
    }
  });
}

export { UserService }
