import { Request, Response, NextFunction } from 'express'
import restaurantRabbitMqClient from '../rabbitmq/client'
import { AuthResponse, Message } from '../../../interfaces/interface'
import uploadToS3 from '../../../services/s3bucket'


export default class menuController {
    addMenuItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log('Request body:', req.body);
            console.log('Files:', req.files);

            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            let imageUrls: string[] = ['', '', ''];


            if (files) {
                const uploadPromises = [];
                if (files['images[0]']) uploadPromises.push(uploadToS3(files['images[0]'][0]));
                if (files['images[1]']) uploadPromises.push(uploadToS3(files['images[1]'][0]));
                if (files['images[2]']) uploadPromises.push(uploadToS3(files['images[2]'][0]));

                const uploadedUrls = await Promise.all(uploadPromises);
                imageUrls = uploadedUrls.concat(imageUrls.slice(uploadedUrls.length));
                console.log(imageUrls, '+++++++++++');

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
            console.log('response :', response);

            res.status(201).json(response);
        } catch (error) {
            console.log('error on addMenuItem side :', error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }

    getAllVariants=async (req:Request,res:Response,next:NextFunction)=>{
        try {
            console.log('ivide ethyy tto :',req.params.id);
            const restaurantId=req.params.id
            
            const operation = 'Get-All-Variants';
            const response = (await restaurantRabbitMqClient.produce(restaurantId, operation)) as Message;
            console.log('response :', response);

            res.status(201).json(response);
        } catch (error) {
            console.log('error on getAllVariants side :', error);
            res
                .status(500)
                .json({ message: "Internal Server Error" });
        }
    }
}
