
import express, { Application } from "express";
import authenticationController from "./controller/authenticationController";
import upload from "../../middleware/multer";

const AuthenticationController = new authenticationController()

const deliveryBoyRoute = express.Router()

deliveryBoyRoute.post('/deliveryBoy-rigister', AuthenticationController.rigister)
deliveryBoyRoute.post('/location', AuthenticationController.deliveryBoyLocation)
deliveryBoyRoute.post(
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
deliveryBoyRoute.post('/vehicle', AuthenticationController.updateVehicle);
deliveryBoyRoute.get('/get-zone', AuthenticationController.getZones)
deliveryBoyRoute.post('/zone', AuthenticationController.updateZone);
deliveryBoyRoute.get('/fetch-resubmit-doc/:id', AuthenticationController.getResubmitedDocs)
deliveryBoyRoute.post(
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

export default deliveryBoyRoute