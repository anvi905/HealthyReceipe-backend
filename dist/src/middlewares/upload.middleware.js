import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "video/mp4",
            "video/webm",
            "video/quicktime",
        ];
        if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new Error("Only supported image and video files are allowed."));
        }
    },
});
export default upload;
//# sourceMappingURL=upload.middleware.js.map