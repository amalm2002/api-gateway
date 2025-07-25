// import { PutObjectCommand, DeleteObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'


import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

async function uploadToS3(file: Express.Multer.File) {
    const filename = Date.now().toString()

    const s3URL = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/`;

    const s3Client = new S3Client({
        region: process.env.AWS_S3_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
    })

    const params={
        Bucket:process.env.AWS_S3_BUCKET,
        Key:filename,
        Body:file.buffer,
        ContentType:file.mimetype
    }

    const command=new PutObjectCommand(params)

    try {
        await s3Client.send(command);
        console.log("Uploaded file to S3 successfully.",`${s3URL}${filename}`);
        return  `${s3URL}${filename}`; 
       } catch (error) {
        console.error("Error uploading file to S3:", error);
        return (error as Error).message;
      }
}

export default uploadToS3


export async function deleteFromS3(imageUrl: string): Promise<void> {
    const s3Client = new S3Client({
        region: process.env.AWS_S3_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
    });

    const bucketName = process.env.AWS_S3_BUCKET!;
    const key = imageUrl.split("/").pop();
    console.log('this log on s3bucket delete image side :', key);


    const deleteParams = {
        Bucket: bucketName,
        Key: key!
    };

    const command = new DeleteObjectCommand(deleteParams);

    try {
        await s3Client.send(command);
        console.log("Deleted old image from S3:", key);
    } catch (err) {
        console.error("Error deleting image from S3:", err);
    }
}




// async function uploadToS3(file: Express.Multer.File) {
//     const filename = Date.now().toString();

//     const s3Client = new S3Client({
//         region: process.env.AWS_S3_REGION,
//         credentials: {
//             accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
//             secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
//         }
//     });

//     const params = {
//         Bucket: process.env.AWS_S3_BUCKET,
//         Key: filename,
//         Body: file.buffer,
//         ContentType: file.mimetype
//     };

//     const command = new PutObjectCommand(params);

//     try {
//         await s3Client.send(command);
//         console.log("Uploaded file to S3 successfully.");

//         const getCommand = new GetObjectCommand({
//             Bucket: process.env.AWS_S3_BUCKET,
//             Key: filename
//         });

//         const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 300 });
//         console.log("Signed URL:", signedUrl);
//         return signedUrl;
//     } catch (error) {
//         console.error("Error uploading file to S3:", error);
//         return (error as Error).message;
//     }
// }

// export default uploadToS3