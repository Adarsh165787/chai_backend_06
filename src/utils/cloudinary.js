import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config({ path: "./.env" });

const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
};

const uplodOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        configureCloudinary();

        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto"
            }
        );

        // File uploaded successfully
        console.log(
            "File uploaded to Cloudinary successfully:",
            response.url
        );

        // Remove file from local storage
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;

    } catch (error) {

        console.log(
            "Cloudinary upload error:",
            error.message
        );

        // Remove local file if it still exists
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uplodOnCloudinary };