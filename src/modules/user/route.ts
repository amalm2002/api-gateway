import express from "express";
import userController from "./controllers/controller";
import MenuController from "../restaurant/controller/menuController";
import CartController from "./controllers/cartController";
import OrderController from "../order/controller/orderController";
import OrderTransactionController from "../payment/controller/orderTransactionController";


const controller = new userController();
const menuController = new MenuController();
const cartController = new CartController()
const orderController = new OrderController()
const orderTransactionController = new OrderTransactionController()

const publicRoute = express.Router();

//signup side
publicRoute.post('/signup', controller.CreateUser);
publicRoute.post('/checkUser', controller.CheckUser)
publicRoute.post('/resendOtp', controller.ResendOtp)

//login side
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
protectedRoute.get('/menu-item/:id', menuController.getSpecificMenu)
protectedRoute.post('/update-menu-quantities', menuController.updateMenuQuantityMenuItems)
protectedRoute.post('/add-to-cart/:id', cartController.AddToCart)
protectedRoute.get('/get-cart/:id', cartController.GetCartItems)
protectedRoute.patch('/update-cart-item/:id', cartController.UpdateCartItemQuantity)
protectedRoute.delete('/remove-cart-item/:userId/:id', cartController.RemoveCartItem)
protectedRoute.delete('/delete-user-cart/:id', cartController.DeleteUserCart)

//check out side 
// protectedRoute.post('/create-order', orderController.createOrder)
// protectedRoute.post('/verify-payment', orderController.verifyPayment)
// protectedRoute.post('/place-order', orderController.placeOrder)

protectedRoute.post('/create-order', orderTransactionController.CreateOrderPayment)
protectedRoute.post('/verify-payment', orderTransactionController.VerifyUpiPayment)
protectedRoute.post('/place-order', orderTransactionController.PlaceOrderPayment)

//order side
protectedRoute.get('/get-orders/:id', orderController.getUsersOrders)
protectedRoute.get('/order-details/:id', orderController.getOrderDetails)
protectedRoute.patch('/order/cancel/:orderId', orderController.cancelOrder);


export { publicRoute, protectedRoute }