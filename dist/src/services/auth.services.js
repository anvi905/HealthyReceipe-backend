import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
export const registerUser = async (data) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
export const loginUser = async (data) => {
    // 1. Find user by email
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }
    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }
    // 3. Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET_MISSING");
    }
    const token = jwt.sign({
        userId: user.id,
        role: user.role,
    }, jwtSecret, {
        expiresIn: "1d",
    });
    // 4. Remove password from response
    const { password, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token,
    };
};
//# sourceMappingURL=auth.services.js.map