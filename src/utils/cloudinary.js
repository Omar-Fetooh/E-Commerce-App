import dotenv from "dotenv"
import path from 'path'
dotenv.config({ path: path.resolve("config/.env") });  // I have inserted these 3 lines because multer has problem with .env paths 

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});


export default cloudinary