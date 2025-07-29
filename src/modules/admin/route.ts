import express, { Application } from "express";
import UserController from "./controller/userController";
import { isValidated } from "../auth/controller";
import RestaurantController from "./controller/restaurantController";
import DeliveryBoyController from "./controller/deliveryBoyController";
import multer from "multer";

const adminRoute: Application = express()

const userController = new UserController()
const restaurantController = new RestaurantController()

const deliveryBoyController = new DeliveryBoyController()

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
adminRoute.put('/updateSubscriptionPlan/:id',restaurantController.editSubscriptionPlans)
adminRoute.delete('/deleteSubscriptionPlan/:id',restaurantController.deleteSubscriptionPlans)
adminRoute.get('/getAllPayments',restaurantController.getAllPaymentsOnRestaurants)

//Delivery-Boy
adminRoute.post('/zone-creation',deliveryBoyController.zoneCreation)
adminRoute.get('/fetch-zone',deliveryBoyController.fetchZones)
adminRoute.delete('/deleteZone/:id',deliveryBoyController.deleteZone)
adminRoute.get('/getAllDeliveryBoys',deliveryBoyController.fetchDeliveryBoys)
adminRoute.patch('/updateDeliveryBoyStatus/:id',deliveryBoyController.updateDeliveryBoyStatus)
adminRoute.get('/getDeliveryBoy/:id',deliveryBoyController.fetchDeliveryBoyDetails)
adminRoute.post('/verifyDeliveryBoyDocs/:id',deliveryBoyController.verifyDeliveryBoyDocuments)
adminRoute.post('/rejectDeliveryBoyDocs',deliveryBoyController.rejectedDeliveryBoyDocuments)
adminRoute.post('/add-ride-payment-rule',deliveryBoyController.addRidePaymentRule)
adminRoute.get('/fetch-ride-rate-payment',deliveryBoyController.getRideRatePaymentRules)
adminRoute.put('/update-ride-payment-rule/:id', deliveryBoyController.updateRidePaymentRule);
adminRoute.put('/block-ride-payment-rule/:id', deliveryBoyController.blockRidePaymentRule);
adminRoute.put('/unblock-ride-payment-rule/:id', deliveryBoyController.unblockRidePaymentRule)

export default adminRoute