import express from "express";
import userController from "./controller";
import { isValidated } from "../auth/controller";


const controller = new userController();

const publicRoute = express.Router();

publicRoute.post('/signup', controller.CreateUser);
publicRoute.post('/checkUser', controller.CheckUser)
publicRoute.post('/resendOtp', controller.ResendOtp)

publicRoute.post('/login', controller.CheckUserLogin)
publicRoute.post('/checkGoogleLoginUser', controller.CheckGoogleSignInUser)
publicRoute.post('/forgot-password-check', controller.ForgotPasswordCheck)
publicRoute.post('/verify-otp',controller.VerifyOtp)
publicRoute.post('/reset-password',controller.RestPassword)

const protectedRoute = express.Router()

export { publicRoute, protectedRoute }