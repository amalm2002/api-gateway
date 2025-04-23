import express,{ Application } from "express";
import UserController from "./controller/userController";
import { isValidated } from "../auth/controller";
import RestaurantController from "./controller/restaurantController";
import multer from "multer";

const adminRoute:Application=express()

const userController=new UserController()
const restaurantController=new RestaurantController()

const upload=multer()

adminRoute.get('/getAllUsers',userController.getAllUsers)
adminRoute.patch('/block-user/:id',userController.blockUsers)

adminRoute.get('/getAllRestaurants',restaurantController.getAllRestaurants)
adminRoute.get('/getRestaurant/:id',restaurantController.findRestaurantById)
adminRoute.post('/verifyRestaurantDocs/:id',restaurantController.verifyRestaurantDocs)
adminRoute.post('/rejectedRestaurantDocs',restaurantController.rejectedRestaurantDocs)


export default adminRoute