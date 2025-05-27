import express from "express";
import userController from "./controller";
import { isValidated } from "../auth/controller";
import MenuController from "../restaurant/controller/menuController";
import CartController from "./cartController";


const controller = new userController();
const menuController = new MenuController();
const cartController = new CartController()

const publicRoute = express.Router();

publicRoute.post('/signup', controller.CreateUser);
publicRoute.post('/checkUser', controller.CheckUser)
publicRoute.post('/resendOtp', controller.ResendOtp)

publicRoute.post('/login', controller.CheckUserLogin)
publicRoute.post('/checkGoogleLoginUser', controller.CheckGoogleSignInUser)
publicRoute.post('/forgot-password-check', controller.ForgotPasswordCheck)
publicRoute.post('/verify-otp', controller.VerifyOtp)
publicRoute.post('/reset-password', controller.RestPassword)


const protectedRoute = express.Router()

//menu side
protectedRoute.get('/restaurant-menus', menuController.getAllDatas)
protectedRoute.post('/sort-menu', menuController.sortMenus)
protectedRoute.get('/get-user/:id', controller.GetUserById)
protectedRoute.put('/edit-profile/:id', controller.EditProfile)
protectedRoute.put('/update-address/:id', controller.addNewAddress)
protectedRoute.delete('/delete-address/:id/:index', controller.deleteUserAddress)

//cart side 
protectedRoute.post('/add-to-cart/:id', cartController.AddToCart)
protectedRoute.get('/get-cart/:id', cartController.GetCartItems)
protectedRoute.patch('/update-cart-item/:id',cartController.UpdateCartItemQuantity)
protectedRoute.delete('/remove-cart-item/:userId/:id',cartController.RemoveCartItem)

export { publicRoute, protectedRoute }