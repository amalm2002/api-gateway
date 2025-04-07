import express,{ Application } from "express";
import multer from "multer";
import restaurantAuthController from "./controller/authController";

const restaurantRoute=express.Router()
const upload = multer();
const AuthController=new restaurantAuthController()

restaurantRoute.post('/restaurant-checking',AuthController.checkRegistration)
restaurantRoute.post('/restaurant-register',AuthController.registration)
restaurantRoute.post('/restaurant-otp-resend',AuthController.resendOtp)
restaurantRoute.post('/restaurant-login',AuthController.checkLogin)

restaurantRoute.post('/restaurant-documents',upload.none(),AuthController.documentSubmission)
restaurantRoute.post('/resubmit-restaurant-docs',upload.none(),AuthController.resubmitRestaurantDocuments)
restaurantRoute.post('/location',AuthController.restaurantLocation)


restaurantRoute.patch('/update-online-status',AuthController.updateOnlineStatus)


export default restaurantRoute