import express, { Application } from "express";
import multer from "multer";
import restaurantAuthController from "./controller/authController";
import menuController from "./controller/menuController";
import upload from "../../middleware/multer";
import subscriptionPlanController from "./controller/subscriptionPlanController";

const publicRestaurantRoute = express.Router()
const uploadCloud = multer();
const AuthController = new restaurantAuthController()
const MenuController = new menuController()
const SubscriptionPlanController = new subscriptionPlanController()


publicRestaurantRoute.post('/restaurant-checking', AuthController.checkRegistration)
publicRestaurantRoute.post('/restaurant-register', AuthController.registration)
publicRestaurantRoute.post('/restaurant-otp-resend', AuthController.resendOtp)
publicRestaurantRoute.post('/restaurant-login', AuthController.checkLogin)

publicRestaurantRoute.post('/restaurant-documents', uploadCloud.none(), AuthController.documentSubmission)
publicRestaurantRoute.post('/resubmit-restaurant-docs', uploadCloud.none(), AuthController.resubmitRestaurantDocuments)
publicRestaurantRoute.post('/location', AuthController.restaurantLocation)

const protectedRestaurantRoute = express.Router()

protectedRestaurantRoute.patch('/update-online-status', AuthController.updateOnlineStatus)
protectedRestaurantRoute.get('/get-online-status/:id', AuthController.fetchOnlineStatus)
protectedRestaurantRoute.post('/menu-items', upload.fields([
  { name: 'images[0]', maxCount: 1 },
  { name: 'images[1]', maxCount: 1 },
  { name: 'images[2]', maxCount: 1 },
]), MenuController.addMenuItems);

protectedRestaurantRoute.get('/variant/:id', MenuController.getAllVariants)
protectedRestaurantRoute.get('/all-menus/:id', MenuController.getAllMenus)
protectedRestaurantRoute.get('/menu-item/:id', MenuController.getSpecificMenu)
// publicRestaurantRoute.get('/variant/:id', MenuController.getAllVariants)
// publicRestaurantRoute.get('/all-menus/:id', MenuController.getAllMenus)
// publicRestaurantRoute.get('/menu-item/:id', MenuController.getSpecificMenu)
protectedRestaurantRoute.put('/edit-menu-item/:id', upload.fields([
  { name: 'images[0]', maxCount: 1 },
  { name: 'images[1]', maxCount: 1 },
  { name: 'images[2]', maxCount: 1 },
]), MenuController.editMenuItems)

// publicRestaurantRoute.patch('/menu/:id', MenuController.softDeleteMenu)
protectedRestaurantRoute.patch('/menu/:id', MenuController.softDeleteMenu)
// publicRestaurantRoute.get('/restaurant-menus', MenuController.getAllDatas)

// protectedRestaurantRoute.get('/get-all-menus',MenuController.getAllDishes)
protectedRestaurantRoute.get('/get-all-plans', SubscriptionPlanController.getAllSubscriptionPlandetails)
protectedRestaurantRoute.get('/check-plan-exist/:id',SubscriptionPlanController.getAnySubscriptionPlanExist)
protectedRestaurantRoute.post('/restaurnt/subscription-plan', SubscriptionPlanController.paymentForSubscriptionPlan)
protectedRestaurantRoute.post('/restaurnt-verify-payment', SubscriptionPlanController.veryfiyPaymentForSubscriptionPlan)
protectedRestaurantRoute.post('/restaurnt-payment-failed', SubscriptionPlanController.handleFailedPayment)
protectedRestaurantRoute.post('/payment/retry/:id', SubscriptionPlanController.retryPayment);
protectedRestaurantRoute.get('/payment/history/:id', SubscriptionPlanController.getTheTransactionHistory)
protectedRestaurantRoute.get('/payment/details/:id', SubscriptionPlanController.getTheTransactionDetails)

export { publicRestaurantRoute, protectedRestaurantRoute }