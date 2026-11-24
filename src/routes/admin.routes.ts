import { Router } from "express";
import { getAdminDashboard } from "../controllers/admin.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get(
    "/dashboard",
    authenticateUser,
    authorizeRoles("ADMIN"),
    getAdminDashboard
);

export default router;