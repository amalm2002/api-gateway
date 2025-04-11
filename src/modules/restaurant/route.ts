import express,{ Application } from "express";
import multer from "multer";
import restaurantAuthController from "./controller/authController";
import menuController from "./controller/menuController";
import upload from "../../middleware/multer";

const restaurantRoute=express.Router()
const uploadCloud = multer();
const AuthController=new restaurantAuthController()
const MenuController=new menuController()

restaurantRoute.post('/restaurant-checking',AuthController.checkRegistration)
restaurantRoute.post('/restaurant-register',AuthController.registration)
restaurantRoute.post('/restaurant-otp-resend',AuthController.resendOtp)
restaurantRoute.post('/restaurant-login',AuthController.checkLogin)

restaurantRoute.post('/restaurant-documents',uploadCloud.none(),AuthController.documentSubmission)
restaurantRoute.post('/resubmit-restaurant-docs',uploadCloud.none(),AuthController.resubmitRestaurantDocuments)
restaurantRoute.post('/location',AuthController.restaurantLocation)


restaurantRoute.patch('/update-online-status',AuthController.updateOnlineStatus)
restaurantRoute.post(
    '/menu-items',
    upload.fields([
      { name: 'images[0]', maxCount: 1 },
      { name: 'images[1]', maxCount: 1 },
      { name: 'images[2]', maxCount: 1 },
    ]),
    MenuController.addMenuItems
  );
restaurantRoute.get('/variant/:id',MenuController.getAllVariants)


export default restaurantRoute