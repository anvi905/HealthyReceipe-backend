import { Router } from "express";
import { addFavoriteController, approveRecipeController, deleteMyRecipeController, editRejectedRecipe, fetchAllRecipes, fetchMyFavorites, fetchMyRecipes, fetchPendingRecipes, fetchPublicRecipeById, fetchPublicRecipes, publishRecipeController, rejectRecipeController, removeFavoriteController, submitRecipe, unpublishRecipeController } from "../controllers/recipe.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
const router = Router();
router.post("/", authenticateUser, submitRecipe);
router.get("/my", authenticateUser, fetchMyRecipes);
router.get("/admin/pending", authenticateUser, authorizeRoles("ADMIN"), fetchPendingRecipes);
router.patch("/:recipeId/approve", authenticateUser, authorizeRoles("ADMIN"), approveRecipeController);
router.patch("/:recipeId/reject", authenticateUser, authorizeRoles("ADMIN"), rejectRecipeController);
router.patch("/:recipeId", authenticateUser, editRejectedRecipe);
router.get("/public", fetchPublicRecipes);
router.patch("/:recipeId/publish", authenticateUser, authorizeRoles("ADMIN"), publishRecipeController);
router.patch("/:recipeId/unpublish", authenticateUser, authorizeRoles("ADMIN"), unpublishRecipeController);
// Add recipe to favorites
router.post("/:recipeId/favorite", authenticateUser, addFavoriteController);
// Remove recipe from favorites
router.delete("/:recipeId/favorite", authenticateUser, removeFavoriteController);
// Get my favorite recipes
router.get("/my/favorites", authenticateUser, fetchMyFavorites);
router.delete("/:recipeId", authenticateUser, deleteMyRecipeController);
router.get("/admin/all", authenticateUser, authorizeRoles("ADMIN"), fetchAllRecipes);
router.get("/:recipeId", fetchPublicRecipeById);
export default router;
//# sourceMappingURL=recipe.routes.js.map