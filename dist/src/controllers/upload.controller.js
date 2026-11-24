import { uploadToCloudinary } from "../services/upload.service.js";
export const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Please select a file to upload.",
            });
        }
        const resourceType = file.mimetype.startsWith("video/")
            ? "video"
            : "image";
        if (!file.mimetype.startsWith("image/") &&
            !file.mimetype.startsWith("video/")) {
            return res.status(400).json({
                success: false,
                message: "Only image and video files are allowed.",
            });
        }
        const fileUrl = await uploadToCloudinary(file, resourceType);
        return res.status(200).json({
            success: true,
            message: "File uploaded successfully!",
            data: {
                url: fileUrl,
                resourceType,
            },
        });
    }
    catch (error) {
        console.error("File upload failed:", error);
        return res.status(500).json({
            success: false,
            message: "File upload failed.",
        });
    }
};
//# sourceMappingURL=upload.controller.js.map