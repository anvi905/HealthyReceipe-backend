import prisma from "../config/prisma.js";
import { createRecipeSchema } from "../validators/recipe.schema.js";
import type { z } from "zod";

type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export const createRecipe = async (
    data: CreateRecipeInput,
    userId: string
) => {
    const validatedData = createRecipeSchema.parse(data);

    const recipe = await prisma.recipe.create({
        data: {
            ...validatedData,
            userId,
        },
    });

    return recipe;
};

export const getMyRecipes = async (userId: string) => {
    const recipes = await prisma.recipe.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return recipes;
};

export const getPendingRecipes = async () => {
    const recipes = await prisma.recipe.findMany({
        where: {
            status: "PENDING",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return recipes;
};

export const approveRecipe = async (recipeId: string) => {
    const recipe = await prisma.recipe.update({
        where: {
            id: recipeId,
        },
        data: {
            status: "APPROVED",
            rejectionReason: null,
        },
    });

    return recipe;
};

export const rejectRecipe = async (
    recipeId: string,
    reason: string
) => {
    const recipe = await prisma.recipe.update({
        where: {
            id: recipeId,
        },
        data: {
            status: "REJECTED",
            rejectionReason: reason,
            isPublished: false,
        },
    });

    return recipe;
};

export const updateRejectedRecipe = async (
    recipeId: string,
    userId: string,
    data: CreateRecipeInput
) => {
    const validatedData = createRecipeSchema.parse(data);

    const existingRecipe = await prisma.recipe.findFirst({
        where: {
            id: recipeId,
            userId,
            status: "REJECTED",
        },
    });

    if (!existingRecipe) {
        throw new Error("REJECTED_RECIPE_NOT_FOUND");
    }

    const updatedRecipe = await prisma.recipe.update({
        where: {
            id: recipeId,
        },
        data: {
            ...validatedData,
            status: "PENDING",
            rejectionReason: null,
            isPublished: false,
        },
    });

    return updatedRecipe;
};

export const getPublicRecipes = async () => {
    const recipes = await prisma.recipe.findMany({
        where: {
            status: "APPROVED",
            isPublished: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            title: true,
            description: true,
            ingredients: true,
            instructions: true,
            imageUrl: true,
            videoUrl: true,
            region: true,
            foodType: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                },
            },
        },
    });

    return recipes;
};

export const publishRecipe = async (recipeId: string) => {
    const recipe = await prisma.recipe.findUnique({
        where: {
            id: recipeId,
        },
    });

    if (!recipe) {
        throw new Error("RECIPE_NOT_FOUND");
    }

    if (recipe.status !== "APPROVED") {
        throw new Error("RECIPE_NOT_APPROVED");
    }

    const updatedRecipe = await prisma.recipe.update({
        where: {
            id: recipeId,
        },
        data: {
            isPublished: true,
        },
    });

    return updatedRecipe;
};

export const unpublishRecipe = async (recipeId: string) => {
    const recipe = await prisma.recipe.findUnique({
        where: {
            id: recipeId,
        },
    });

    if (!recipe) {
        throw new Error("RECIPE_NOT_FOUND");
    }

    const updatedRecipe = await prisma.recipe.update({
        where: {
            id: recipeId,
        },
        data: {
            isPublished: false,
        },
    });

    return updatedRecipe;
};

export const addFavorite = async (
    recipeId: string,
    userId: string
) => {
    const recipe = await prisma.recipe.findFirst({
        where: {
            id: recipeId,
            status: "APPROVED",
            isPublished: true,
        },
    });

    if (!recipe) {
        throw new Error("PUBLIC_RECIPE_NOT_FOUND");
    }

    const favorite = await prisma.favorite.upsert({
        where: {
            userId_recipeId: {
                userId,
                recipeId,
            },
        },
        update: {},
        create: {
            userId,
            recipeId,
        },
    });

    return favorite;
};

export const removeFavorite = async (
    recipeId: string,
    userId: string
) => {
    const favorite = await prisma.favorite.findUnique({
        where: {
            userId_recipeId: {
                userId,
                recipeId,
            },
        },
    });

    if (!favorite) {
        throw new Error("FAVORITE_NOT_FOUND");
    }

    await prisma.favorite.delete({
        where: {
            userId_recipeId: {
                userId,
                recipeId,
            },
        },
    });

    return true;
};

export const getMyFavorites = async (userId: string) => {
    const favorites = await prisma.favorite.findMany({
        where: {
            userId,
            recipe: {
                status: "APPROVED",
                isPublished: true,
            },
        },
        include: {
            recipe: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return favorites;
};

export const deleteMyRecipe = async (
    recipeId: string,
    userId: string
) => {
    const recipe = await prisma.recipe.findFirst({
        where: {
            id: recipeId,
            userId,
        },
    });

    if (!recipe) {
        throw new Error("RECIPE_NOT_FOUND");
    }

    await prisma.recipe.delete({
        where: {
            id: recipeId,
        },
    });

    return true;
};

export const getAllRecipes = async () => {
    const recipes = await prisma.recipe.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return recipes;
};

export const getPublicRecipeById = async (recipeId: string) => {
    const recipe = await prisma.recipe.findFirst({
        where: {
            id: recipeId,
            status: "APPROVED",
            isPublished: true,
        },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (!recipe) {
        throw new Error("PUBLIC_RECIPE_NOT_FOUND");
    }

    return recipe;
};