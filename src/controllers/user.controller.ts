import type { Request, Response } from "express";

export const getProfile = (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Profile fetched successfully!",
        data: {
            userId: req.user?.userId,
            role: req.user?.role,
        },
    });
};