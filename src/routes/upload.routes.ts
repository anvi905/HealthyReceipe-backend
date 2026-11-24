
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import upload from "../middlewares/upload.middleware.js";
import { uploadFile } from "../controllers/upload.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/",
    authenticateUser,
    (req: Request, res: Response, next: NextFunction) => {
        upload.single("file")(req, res, (error) => {
            if (error instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    message:
                        error.code === "LIMIT_FILE_SIZE"
                            ? "File size must not exceed 50 MB."
                            : error.message,
                });
            }

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            next();
        });
    },
    uploadFile
);

export default router;
