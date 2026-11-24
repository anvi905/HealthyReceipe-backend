import { addFavorite, approveRecipe, createRecipe, deleteMyRecipe, getAllRecipes, getMyFavorites, getMyRecipes, getPendingRecipes, getPublicRecipeById, getPublicRecipes, publishRecipe, rejectRecipe, removeFavorite, unpublishRecipe, updateRejectedRecipe } from "../services/recipe.service.js";
import { rejectRecipeSchema } from "../validators/recipe.schema.js";
export const submitRecipe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }
        const recipe = await createRecipe(req.body, req.user.userId);
        return res.status(201).json({
            success: true,
            message: "Recipe submitted successfully!",
            data: recipe,
        });
    }
    catch (error) {
        console.error("Recipe submission failed:", error);
        return res.status(400).json({
            success: false,
            message: "Recipe submission failed. Please check your input.",
        });
    }
};
export const fetchMyRecipes = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }
        const recipes = await getMyRecipes(req.user.userId);
        return res.status(200).json({
            success: true,
            message: "Your recipes fetched successfully!",
            data: recipes,
        });
    }
    catch (error) {
        console.error("Fetching recipes failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your recipes.",
        });
    }
};
export const fetchPendingRecipes = async (req, res) => {
    try {
        const recipes = await getPendingRecipes();
        return res.status(200).json({
            success: true,
            message: "Pending recipes fetched successfully!",
            data: recipes,
        });
    }
    catch (error) {
        console.error("Fetching pending recipes failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending recipes.",
        });
    }
};
export const approveRecipeController = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        if (typeof recipeId !== "string" || !recipeId.trim()) {
            return res.status(400).json({
                success: false,
                message: "Valid Recipe ID is required.",
            });
        }
        const recipe = await approveRecipe(recipeId);
        return res.status(200).json({
            success: true,
            message: "Recipe approved successfully!",
            data: recipe,
        });
    }
    catch (error) {
        console.error("Recipe approval failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to approve recipe.",
        });
    }
};
export const rejectRecipeController = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        if (typeof recipeId !== "string" || !recipeId.trim()) {
            return res.status(400).json({
                success: false,
                message: "Valid Recipe ID is required.",
            });
        }
        const validation = rejectRecipeSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: validation.error.issues[0]?.message,
            });
        }
        const recipe = await rejectRecipe(recipeId, validation.data.reason);
        return res.status(200).json({
            success: true,
            message: "Recipe rejected successfully!",
            data: recipe,
        });
    }
    catch (error) {
        console.error("Recipe rejection failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject recipe.",
        });
    }
};
export const editRejectedRecipe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }
        const recipeId = req.params.recipeId;
        if (typeof recipeId !== "string" || !recipeId.trim()) {
            return res.status(400).json({
                success: false,
                message: "Valid Recipe ID is required.",
            });
        }
        const recipe = await updateRejectedRecipe(recipeId, req.user.userId, req.body);
        return res.status(200).json({
            success: true,
            message: "Recipe updated and resubmitted successfully!",
            data: recipe,
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "REJECTED_RECIPE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Rejected recipe not found or you don't have permission to edit it.",
            });
        }
        console.error("Recipe update failed:", error);
        return res.status(400).json({
            success: false,
            message: "Recipe update failed. Please check your input.",
        });
    }
};
export const fetchPublicRecipes = async (req, res) => {
    try {
        const recipes = await getPublicRecipes();
        return res.status(200).json({
            success: true,
            message: "Public recipes fetched successfully!",
            data: recipes,
        });
    }
    catch (error) {
        console.error("Public recipes fetch failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch public recipes.",
        });
    }
};
export const publishRecipeController = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        if (typeof recipeId !== "string" || !recipeId.trim()) {
            return res.status(400).json({
                success: false,
                message: "Valid Recipe ID is required.",
            });
        }
        const recipe = await publishRecipe(recipeId);
        return res.status(200).json({
            success: true,
            message: "Recipe published successfully!",
            data: recipe,
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "RECIPE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Recipe not found.",
            });
        }
        if (error instanceof Error && error.message === "RECIPE_NOT_APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Only approved recipes can be published.",
            });
        }
        console.error("Recipe publishing failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to publish recipe.",
        });
    }
};
export const unpublishRecipeController = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        if (typeof recipeId !== "string" || !recipeId.trim()) {
            return res.status(400).json({
                success: false,
                message: "Valid Recipe ID is required.",
            });
        }
        const recipe = await unpublishRecipe(recipeId);
        return res.status(200).json({
            success: true,
            message: "Recipe unpublished successfully!",
            data: recipe,
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "RECIPE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Recipe not found.",
            });
        }
        console.error("Recipe unpublishing failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to unpublish recipe.",
        });
    }
};
export const addFavoriteController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }
        const recipeId = req.params.recipeId;
        if (typeof recipeId !== "string" || !recipeId.trim()) {
            return res.status(400).json({
                success: false,
                message: "Valid Recipe ID is required.",
            });
        }
        const favorite = await addFavorite(recipeId, req.user.userId);
        return res.status(200).json({
            success: true,
            message: "Recipe added to favorites!",
            data: favorite,
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "PUBLIC_RECIPE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Public recipe not found.",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to add favorite.",
        });
    }
};
export const removeFavoriteController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }
        const recipeId = req.params.recipeId;
        if (typeof recipeId !== "string" || !recipeId.trim()) {
            return res.status(400).json({
                success: false,
                message: "Valid Recipe ID is required.",
            });
        }
        await removeFavorite(recipeId, req.user.userId);
        return res.status(200).json({
            success: true,
            message: "Recipe removed from favorites!",
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "FAVORITE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Favorite not found.",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to remove favorite.",
        });
    }
};
export const fetchMyFavorites = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }
        const favorites = await getMyFavorites(req.user.userId);
        return res.status(200).json({
            success: true,
            message: "Favorites fetched successfully!",
            data: favorites,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch favorites.",
        });
    }
};
export const deleteMyRecipeController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login first.",
            });
        }
        const recipeId = req.params.recipeId;
        if (typeof recipeId !== "string" || !recipeId.trim()) {
            return res.status(400).json({
                success: false,
                message: "Valid Recipe ID is required.",
            });
        }
        await deleteMyRecipe(recipeId, req.user.userId);
        return res.status(200).json({
            success: true,
            message: "Recipe deleted successfully!",
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "RECIPE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Recipe not found or you don't have permission to delete it.",
            });
        }
        console.error("Recipe deletion failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete recipe.",
        });
    }
};
export const fetchAllRecipes = async (req, res) => {
    try {
        const recipes = await getAllRecipes();
        return res.status(200).json({
            success: true,
            message: "All recipes fetched successfully!",
            data: recipes,
        });
    }
    catch (error) {
        console.error("All recipes fetch failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recipes.",
        });
    }
};
export const fetchPublicRecipeById = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        if (typeof recipeId !== "string" || !recipeId.trim()) {
            return res.status(400).json({
                success: false,
                message: "Valid Recipe ID is required.",
            });
        }
        const recipe = await getPublicRecipeById(recipeId);
        return res.status(200).json({
            success: true,
            message: "Recipe details fetched successfully!",
            data: recipe,
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "PUBLIC_RECIPE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Public recipe not found.",
            });
        }
        console.error("Recipe details fetch failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recipe details.",
        });
    }
};
//# sourceMappingURL=recipe.controller.js.map