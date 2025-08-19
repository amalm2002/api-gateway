
import { Request, Response } from 'express'
import { UserService } from '../config/user.client';

export default class CartController {
    GetCartItems = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id
            UserService.GetCartItems({ userId }, (err: any, result: any) => {
                if (err) {
                    console.log('get cart side err :', err);
                    res.status(400).json({ message: err.message });
                } else {
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
                    restaurantId: req.body.restaurant_id,
                    restaurantName: req.body.restaurant_name,
                    discount: req.body.discount,
                    description: req.body.description,
                    timing: req.body.timing,
                    rating: req.body.rating,
                    hasVariants: req.body.hasVariants,
                    images: req.body.images,
                    variants: req.body.variants || [],
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

    DeleteUserCart = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id
            UserService.DeleteUserCart({ userId }, (err: any, result: any) => {
                if (err) {
                    console.log('deleteUser err :', err);
                    res.status(400).json({ message: err.message });
                } else {
                    res.status(200).json({ message: result.message, success: result.success });
                }
            })
        } catch (error) {
            console.log('DeleteUserCart side:', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

}