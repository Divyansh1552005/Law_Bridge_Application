// connecting cloudinary

import { v2 as cloudinary } from "cloudinary";

export const connectCloudinary = async () => {  
    // no async becoz cloudinary config is synchronous
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });

}


