import express, { Application } from "express";
import multer from "multer";
import restaurantAuthController from "./controller/authController";
import menuController from "./controller/menuController";
import upload from "../../middleware/multer";

const publicRestaurantRoute = express.Router()
const uploadCloud = multer();
const AuthController = new restaurantAuthController()
const MenuController = new menuController()

publicRestaurantRoute.post('/restaurant-checking', AuthController.checkRegistration)
publicRestaurantRoute.post('/restaurant-register', AuthController.registration)
publicRestaurantRoute.post('/restaurant-otp-resend', AuthController.resendOtp)
publicRestaurantRoute.post('/restaurant-login', AuthController.checkLogin)

publicRestaurantRoute.post('/restaurant-documents', uploadCloud.none(), AuthController.documentSubmission)
publicRestaurantRoute.post('/resubmit-restaurant-docs', uploadCloud.none(), AuthController.resubmitRestaurantDocuments)
publicRestaurantRoute.post('/location', AuthController.restaurantLocation)

const protectedRestaurantRoute = express.Router()

protectedRestaurantRoute.patch('/update-online-status', AuthController.updateOnlineStatus)
protectedRestaurantRoute.get('/get-online-status/:id',AuthController.fetchOnlineStatus)
protectedRestaurantRoute.post('/menu-items', upload.fields([
  { name: 'images[0]', maxCount: 1 },
  { name: 'images[1]', maxCount: 1 },
  { name: 'images[2]', maxCount: 1 },
]), MenuController.addMenuItems);

publicRestaurantRoute.get('/variant/:id', MenuController.getAllVariants)
publicRestaurantRoute.get('/all-menus/:id', MenuController.getAllMenus)
publicRestaurantRoute.get('/menu-item/:id', MenuController.getSpecificMenu)
protectedRestaurantRoute.put('/edit-menu-item/:id', upload.fields([
  { name: 'images[0]', maxCount: 1 },
  { name: 'images[1]', maxCount: 1 },
  { name: 'images[2]', maxCount: 1 },
]), MenuController.editMenuItems)

publicRestaurantRoute.patch('/menu/:id', MenuController.softDeleteMenu)
publicRestaurantRoute.get('/restaurant-menus', MenuController.getAllDatas)

// protectedRestaurantRoute.get('/get-all-menus',MenuController.getAllDishes)
protectedRestaurantRoute.post('/sort-menu',MenuController.sortMenus)


export  {publicRestaurantRoute,protectedRestaurantRoute}