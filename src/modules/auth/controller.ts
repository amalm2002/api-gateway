import { Request, Response, NextFunction } from "express";
import { AuthClient } from "./config/auth.client";
import AsyncHandler from "express-async-handler";
import { UserCredentials, Tokens } from "../../interfaces/interface";


export const isValidated = AsyncHandler((req: Request, res: Response, next: NextFunction) => {
    try {
        
        const token = req.headers.authorization?.trim().split(" ")[1]
        
        AuthClient.IsAuthenticated({ token }, (err: any, result: UserCredentials) => {
            if (err) {
                console.log(err);
                
                console.log('this error show on isValidate side');
                res.status(401).json({ success: false, message: err })
            } else {
                next()
            }
        })

    } catch (error) {
        console.log('error on the auth service isValidate function', (error as Error).message);
    }
})

export const refreshToken = (req: Request, res: Response, next: NextFunction) => {
    try {     
        const token =req.headers.authorization?.trim().split(" ")[1] || req.body.token
        
        if (token) {
            AuthClient.RefreshToken({token},(err:any,result:Tokens)=>{
                            
                if (err) {
                    console.log('error on refresh token side',err);
                    res.status(401).json({message:'invalid token'})
                }else {
                    console.log(token,'is getting on refresh...........');
                    res.status(200).json({success:true,token:result?.accessToken,refreshToken:result?.refreshToken,message:'new token generated success'})
                }
            })
        }else{
            res.status(401).json({message:'token is missing'})
        }
    } catch (error) {
        console.log('error on the refreshtoken side auth-service', (error as Error).message);

    }
}