import jwt from "jsonwebtoken";
export const authenticateUser = (req, res, next) => {
    try {
        // 1. Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required.",
            });
        }
        // 2. Extract token
        const token = authHeader.split(" ")[1];
        // 3. Check JWT secret
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({
                success: false,
                message: "JWT secret is not configured.",
            });
        }
        // 4. Verify token
        const decoded = jwt.verify(token, jwtSecret);
        // 5. Attach user data to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};
//# sourceMappingURL=auth.middleware.js.map