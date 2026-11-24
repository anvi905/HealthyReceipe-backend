import { registerSchema } from "../validators/auth.schema.js";
import { loginUser, registerUser } from "../services/auth.services.js";
import { loginSchema } from "../validators/auth.schema.js";
export const register = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues,
            });
            return;
        }
        const user = await registerUser(validation.data);
        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: user,
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
            res.status(409).json({
                success: false,
                message: "Email already registered. Please login.",
            });
            return;
        }
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong during registration.",
        });
    }
};
export const login = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues,
            });
            return;
        }
        const result = await loginUser(validation.data);
        res.status(200).json({
            success: true,
            message: "Login successful!",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
            res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
            return;
        }
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong during login.",
        });
    }
};
//# sourceMappingURL=auth.controller.js.map