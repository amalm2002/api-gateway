import express from "express";
import userController from "./controller";


const controller = new userController();

const userRoute = express.Router();

userRoute.post('/signup',controller.CreateUser);
userRoute.post('/checkUser',controller.CheckUser)
userRoute.post('/resendOtp',controller.ResendOtp)

userRoute.post('/login',controller.CheckUserLogin)
userRoute.post('/checkGoogleLoginUser',controller.CheckGoogleSignInUser)


export default userRoute