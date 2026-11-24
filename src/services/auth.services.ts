import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { registerSchema } from "../validators/auth.schema.js";
import type { z } from "zod";
import jwt from "jsonwebtoken";
import { loginSchema } from "../validators/auth.schema.js";

type RegisterInput = z.infer<typeof registerSchema>;

export const registerUser = async (data: RegisterInput) => {
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

type LoginInput = z.infer<typeof loginSchema>;

export const loginUser = async (data: LoginInput) => {
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
    const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // 3. Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET_MISSING");
    }

    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role,
        },
        jwtSecret,
        {
            expiresIn: "1d",
        }
    );

    // 4. Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        token,
    };
};