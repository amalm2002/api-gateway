import { Request, Response, NextFunction } from 'express'
import restaurantRabbitMqClient from '../rabbitmq/client'
import { AuthResponse, Message } from '../../../interfaces/interface'
import uploadToS3, { deleteFromS3 } from '../../../services/s3bucket'



export default class menuController {

    addMenuItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            let imageUrls: string[] = ['', '', ''];

            if (files) {
                const uploadPromises = [];
                if (files['images[0]']) uploadPromises.push(uploadToS3(files['images[0]'][0]));
                if (files['images[1]']) uploadPromises.push(uploadToS3(files['images[1]'][0]));
                if (files['images[2]']) uploadPromises.push(uploadToS3(files['images[2]'][0]));

                const uploadedUrls = await Promise.all(uploadPromises);
                imageUrls = uploadedUrls.concat(imageUrls.slice(uploadedUrls.length));
            }

            const variants = req.body.variants ? JSON.parse(req.body.variants) : [];

            const menuData = {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: parseFloat(req.body.price),
                quantity: parseInt(req.body.quantity, 10),
                images: imageUrls,
                hasVariants: req.body.hasVariants === 'true',
                variants,
                timing: req.body.timing,
                restaurantId: req.body.restaurantId,
            };

            const operation = 'Restaurant-add-menu-item';
            const response = (await restaurantRabbitMqClient.produce(menuData, operation)) as Message;
            res.status(201).json(response);
        } catch (error) {
            console.log('error on addMenuItem side :', error);
            const errorMessage = (error as Error).message;
            if (errorMessage === 'Menu item already exists') {
                res.status(409).json({ message: errorMessage });
            } else {
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }

    getAllVariants = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const restaurantId = req.params.id
            const operation = 'Get-All-Variants';
            const response = (await restaurantRabbitMqClient.produce(restaurantId, operation)) as Message;
            res.status(201).json(response);
        } catch (error) {
            console.log('error on getAllVariants side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    getAllMenus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const restaurantId = req.params.id
            const { search, category } = req.query;
            const payload = { restaurantId, search: search as string, category: category as string };
            const operation = 'Get-All-Menus';
            const response = (await restaurantRabbitMqClient.produce(payload, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('error on getAllMenu side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    getSpecificMenu = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const restaurantId = req.params.id
            const operation = 'Get-Specific-Menu'
            const response = (await restaurantRabbitMqClient.produce(restaurantId, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('error on get specific menu side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    editMenuItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const menuId = req.params.id;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            const existingImages: string[] = req.body.existingImages ? JSON.parse(req.body.existingImages) : ['', '', ''];
            let newImages: string[] = [...existingImages];

            for (let i = 0; i < 3; i++) {
                const field = `images[${i}]`;
                if (files && files[field]) {
                    if (existingImages[i]) {
                        await deleteFromS3(existingImages[i]);
                    }
                    const uploadedUrl = await uploadToS3(files[field][0]);
                    newImages[i] = uploadedUrl;
                }
            }

            const variants = req.body.variants ? JSON.parse(req.body.variants) : [];

            const updatedMenuData = {
                restaurantId: menuId,
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: parseFloat(req.body.price),
                quantity: parseInt(req.body.quantity, 10),
                images: newImages,
                hasVariants: req.body.hasVariants === 'true',
                variants,
                timing: req.body.timing,

            };

            const operation = 'Restaurant-edit-menu-item';
            const response = await restaurantRabbitMqClient.produce(updatedMenuData, operation) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.log('error on editMenuItem side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    softDeleteMenu = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const restaurantId = req.params.id
            const operation = 'Delete-Menu'
            const response = (await restaurantRabbitMqClient.produce(restaurantId, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('error on delete menu side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    getAllDatas = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const operation = 'Get-All-Restaurant-Data'
            const response = (await restaurantRabbitMqClient.produce({}, operation)) as Message
            res.status(200).json(response)
        } catch (error) {
            console.log('error on get all details side :', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    sortMenus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tempSortOption, searchTerm, category } = req.body;
            const operation = 'Sort-Menu-Items';
            const response = (await restaurantRabbitMqClient.produce(
                { sortValue: tempSortOption, searchTerm: searchTerm || '', category: category || 'All' },
                operation
            )) as Message;
            res.status(200).json(response);
        } catch (error) {
            console.log('Error in sortMenus controller:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    updateMenuQuantityMenuItems = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const operation = 'Update-Menu-Quantity'
            const response: Message = (await restaurantRabbitMqClient.produce({ ...req.body }, operation)) as Message
            res.status(200).json(response);
        } catch (error) {
            console.log('Error in updateMenuQuantityMenuItems controller:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    cancelOrderMenuQuantityUpdate = async (refundData: {
        userId: string;
        restaurantId: string;
        items: Array<{ menuId: string; quantity: number }>
    }) => {
        try {
            const operation = 'Update-Menu-Quantity-Cancel-Order';
            const result = await restaurantRabbitMqClient.produce(refundData, operation);
            console.log('Menu quantity updated in restaurant service:', result);
            return result;
        } catch (error) {
            console.error('Error updating menu quantity:', error);
            return { success: false, message: 'Failed to update menu quantity' };
        }
    }
}
