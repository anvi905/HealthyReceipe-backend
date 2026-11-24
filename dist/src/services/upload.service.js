import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
export const uploadToCloudinary = async (file, resourceType) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: resourceType,
            folder: "healthyreceipe",
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result?.secure_url) {
                return reject(new Error("Cloudinary upload failed."));
            }
            resolve(result.secure_url);
        });
        Readable.from(file.buffer).pipe(uploadStream);
    });
};
//# sourceMappingURL=upload.service.js.map