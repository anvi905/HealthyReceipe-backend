import type { Request, Response } from "express";

export const getAdminDashboard = (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Admin Dashboard!",
        data: {
            userId: req.user?.userId,
            role: req.user?.role,
        },
    });
};