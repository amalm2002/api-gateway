import express,{ Application } from "express";
import UserController from "./controller/userController";
import { isValidated } from "../auth/controller";
import RestaurantController from "./controller/restaurantController";
import multer from "multer";

const adminRoute:Application=express()

const userController=new UserController()
const restaurantController=new RestaurantController()

const upload=multer()

adminRoute.get('/getAllUsers',isValidated,userController.getAllUsers)
adminRoute.patch('/block-user/:id',isValidated,userController.blockUsers)

adminRoute.get('/getAllRestaurants',isValidated,restaurantController.getAllRestaurants)
adminRoute.get('/getRestaurant/:id',isValidated,restaurantController.findRestaurantById)
adminRoute.post('/verifyRestaurantDocs/:id',isValidated,restaurantController.verifyRestaurantDocs)
adminRoute.post('/rejectedRestaurantDocs',isValidated,restaurantController.rejectedRestaurantDocs)


export default adminRoute