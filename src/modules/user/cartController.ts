
import { Request, Response } from 'express'
import { UserService } from './config/user.client'

export default class CartController {
    GetCartItems = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id
            // console.log('ussssss :',userId);

            UserService.GetCartItems({ userId }, (err: any, result: any) => {
                if (err) {
                    console.log('get cart side err :', err);
                    res.status(400).json({ message: err.message });
                } else {
                    // console.log('result :', result);
                    res.status(200).json({ message: result.message, response: result });
                }
            })

        } catch (error) {
            console.log('get cart side:', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    AddToCart = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id
            UserService.AddToCart({
                item: {
                    menuId: req.body.food_id,
                    quantity: req.body.quantity,
                    price: req.body.price,
                    name: req.body.name,
                    category: req.body.category,
                    restaurantName: req.body.restaurant_name,
                    discount: req.body.discount
                },
                userId
            },
                (err: any, result: any) => {
                    if (err) {
                        console.log('errr :', err);
                        res.status(400).json({ message: err.message });
                    } else {
                        res.status(200).json({ message: result.message, response: result });
                    }
                })

        } catch (error) {
            console.log('add to cart side:', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    UpdateCartItemQuantity = async (req: Request, res: Response) => {
        try {
            // console.log('bodyyyyyyy :', req.body, 'params :', req.params.id);
            const userId = req.params.id
            const { menuId, quantity } = req.body
            UserService.UpdateCartItemQuantity({ userId, menuId, quantity },
                (err: any, result: any) => {
                    if (err) {
                        console.log('updateQty err :', err);
                        res.status(400).json({ message: err.message });
                    } else {
                        res.status(200).json({ message: result.message, response: result });
                    }
                })
        } catch (error) {
            console.log('updateQuantity side:', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    RemoveCartItem = async (req: Request, res: Response) => {
        try {
            console.log(req.params);
            const userId = req.params.userId
            const menuId = req.params.id

            UserService.RemoveCartItem({ userId, menuId }, (err: any, result: any) => {
                if (err) {
                    console.log('removeCartItems err :', err);
                    res.status(400).json({ message: err.message });
                } else {
                    res.status(200).json({ message: result.message, response: result });
                }
            })

        } catch (error) {
            console.log('RemoveCartItem side:', error);
            res.status(500).json({ message: "Internal Server Error" });

        }
    }
}