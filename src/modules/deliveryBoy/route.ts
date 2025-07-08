
import express, { Application } from "express";
import authenticationController from "./controller/authenticationController";
import upload from "../../middleware/multer";
import deliveryPartnerController from "./controller/deliveryPartnerController";
import orderController from "../order/controller/orderController";
import userController from "../user/controllers/controller";

const AuthenticationController = new authenticationController()
const DeliveryPartnerController = new deliveryPartnerController()
const OrderController = new orderController()
const UserController = new userController()

const deliveryBoyPublicRoute = express.Router()

deliveryBoyPublicRoute.post('/deliveryBoy-rigister', AuthenticationController.rigister)
deliveryBoyPublicRoute.post('/location', AuthenticationController.deliveryBoyLocation)
deliveryBoyPublicRoute.post(
    '/details',
    upload.fields([
        { name: 'panCard[images][0]', maxCount: 1 },
        { name: 'panCard[images][1]', maxCount: 1 },
        { name: 'license[images][0]', maxCount: 1 },
        { name: 'license[images][1]', maxCount: 1 },
        { name: 'profileImage', maxCount: 1 },
    ]),
    AuthenticationController.updateDetails
);
deliveryBoyPublicRoute.post('/vehicle', AuthenticationController.updateVehicle);
deliveryBoyPublicRoute.get('/get-zone', AuthenticationController.getZones)
deliveryBoyPublicRoute.post('/zone', AuthenticationController.updateZone);
deliveryBoyPublicRoute.get('/fetch-resubmit-doc/:id', AuthenticationController.getResubmitedDocs)
deliveryBoyPublicRoute.post(
    '/details/resubmit',
    upload.fields([
        { name: 'panCard[images][0]', maxCount: 1 },
        { name: 'panCard[images][1]', maxCount: 1 },
        { name: 'license[images][0]', maxCount: 1 },
        { name: 'license[images][1]', maxCount: 1 },
        { name: 'profileImage', maxCount: 1 },
    ]),
    AuthenticationController.reSubmittedDocuments
);

const deliveryBoyProtectedRoute = express.Router()

deliveryBoyProtectedRoute.post('/enable-online/:id', DeliveryPartnerController.enableTheOnlineOption)
deliveryBoyProtectedRoute.get('/delivery-boy/:id', DeliveryPartnerController.getDeliveryBoyDetails)
deliveryBoyProtectedRoute.post('/update-location/:id', DeliveryPartnerController.updateLocation);

deliveryBoyProtectedRoute.post('/assign-delivery-boy', DeliveryPartnerController.assignOrderOnDeliveryPartner)
deliveryBoyProtectedRoute.post('/update-delivery-boy-location', DeliveryPartnerController.updateDeliveryLocation)
deliveryBoyProtectedRoute.post('/verify-order-number', OrderController.verifyOrderNumber)
deliveryBoyProtectedRoute.get('/get-user/:id', UserController.GetUserById)
deliveryBoyProtectedRoute.get('/order-details/:id', OrderController.getOrderDetails)
deliveryBoyProtectedRoute.post('/complete-order', DeliveryPartnerController.completeDelivery)
deliveryBoyProtectedRoute.get('/delivery-partner/order/:id', OrderController.getDeliveryPartnerOrders)

export { deliveryBoyPublicRoute, deliveryBoyProtectedRoute }