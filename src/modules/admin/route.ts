import express, { Application } from "express";
import UserController from "./controller/userController";
import { isValidated } from "../auth/controller";
import RestaurantController from "./controller/restaurantController";
import DeliveryBoyController from "./controller/deliveryBoyController";
import multer from "multer";
import PaymentTransactionController from "../payment/controller/paymentTransactionController";

const adminRoute: Application = express()

const userController = new UserController()
const restaurantController = new RestaurantController()
const deliveryBoyController = new DeliveryBoyController()
const paymentTransactionController = new PaymentTransactionController()

const upload = multer()

//User-Side
adminRoute.get('/getAllUsers', userController.getAllUsers)
adminRoute.patch('/block-user/:id', userController.blockUsers)

//Restaurnt-Side
adminRoute.get('/getAllRestaurants', restaurantController.getAllRestaurants)
adminRoute.get('/getRestaurant/:id', restaurantController.findRestaurantById)
adminRoute.post('/verifyRestaurantDocs/:id', restaurantController.verifyRestaurantDocs)
adminRoute.post('/rejectedRestaurantDocs', restaurantController.rejectedRestaurantDocs)
adminRoute.get('/getSubscriptionPlans', restaurantController.getAllSubscriptionPlans)
adminRoute.post('/addSubscriptionPlan', restaurantController.addNewSubScriptionPlan)
adminRoute.put('/updateSubscriptionPlan/:id', restaurantController.editSubscriptionPlans)
adminRoute.delete('/deleteSubscriptionPlan/:id', restaurantController.deleteSubscriptionPlans)
adminRoute.get('/getAllPayments', restaurantController.getAllPaymentsOnRestaurants)

//Delivery-Boy
adminRoute.post('/zone-creation', deliveryBoyController.zoneCreation)
adminRoute.get('/fetch-zone', deliveryBoyController.fetchZones)
adminRoute.delete('/deleteZone/:id', deliveryBoyController.deleteZone)
adminRoute.get('/getAllDeliveryBoys', deliveryBoyController.fetchDeliveryBoys)
adminRoute.patch('/updateDeliveryBoyStatus/:id', deliveryBoyController.updateDeliveryBoyStatus)
adminRoute.get('/getDeliveryBoy/:id', deliveryBoyController.fetchDeliveryBoyDetails)
adminRoute.post('/verifyDeliveryBoyDocs/:id', deliveryBoyController.verifyDeliveryBoyDocuments)
adminRoute.post('/rejectDeliveryBoyDocs', deliveryBoyController.rejectedDeliveryBoyDocuments)

//delivery-boy add payment rule depends on KM
adminRoute.post('/add-ride-payment-rule', deliveryBoyController.addRidePaymentRule)
adminRoute.get('/fetch-ride-rate-payment', deliveryBoyController.getRideRatePaymentRules)
adminRoute.put('/update-ride-payment-rule/:id', deliveryBoyController.updateRidePaymentRule);
adminRoute.put('/block-ride-payment-rule/:id', deliveryBoyController.blockRidePaymentRule);
adminRoute.put('/unblock-ride-payment-rule/:id', deliveryBoyController.unblockRidePaymentRule)

//delivery-boy earnings payments
adminRoute.post('/create-delivery-partner-order', paymentTransactionController.CreateDeliveryBoyPayment)
adminRoute.post('/verify-payment-delivery-partner', paymentTransactionController.VerifyDeliveryBoyPayment)
adminRoute.post('/cancel-delivery-partner-payment', paymentTransactionController.CancelDeliveryBoyPayment);

//delivery-boy help options
adminRoute.post('/delivery-boy/add-help-option', deliveryBoyController.addDeliveryBoyHelpOptions)
adminRoute.put('/delivery-boy/update-help-option/:id', deliveryBoyController.updateDeliveryBoyHelpOptions);
adminRoute.delete('/delivery-boy/delete-help-option/:id', deliveryBoyController.deleteDeliveryBoyHelpOptions);
adminRoute.get('/delivery-boy/get-all-help-options', deliveryBoyController.getAllDeliveryBoyHelpOptions);

adminRoute.get('/get-all-concern',deliveryBoyController.getAllConcerns)
adminRoute.patch('/verify-concern',deliveryBoyController.verifyTheConcern)

//dashboard section
adminRoute.get('/getRestaurantChartData', restaurantController.getRestaurantChartData);
adminRoute.get('/getDeliveryBoyChartData', deliveryBoyController.getDeliveryBoyChartData);

export default adminRoute