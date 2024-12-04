import {v2 as cloudinary} from 'cloudinary';
import config from '../Config/config';
cloudinary.config({
    cloud_name: config.cloudinaryName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
});

// Function that uploads the file

export async function uploadFile(fileStr: string, publicId?: string) {
    try {
        // We can create our options that we will pass into the upload method
        const options: any = {
            resource_type: "image" as "image",
            folder: "mw_profile_pictures"
        }
        if(publicId) {
            options["public_id"] = publicId;
        }
        const result = await cloudinary.uploader.upload(fileStr, options);
        return result;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Cloudinary upload failed");
    }
}

export async function deleteFile(publicId: string) {
    try {
        await cloudinary.uploader.destroy(`mw_profile_pictures/${publicId}`);
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        throw new Error("Cloudinary delete failed");
    }
}