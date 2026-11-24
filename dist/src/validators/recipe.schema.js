import { z } from "zod";
export const createRecipeSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    ingredients: z.string().trim().min(3, "Ingredients are required"),
    instructions: z.string().trim().min(10, "Instructions must be at least 10 characters"),
    region: z.string().trim().min(2, "Region is required"),
    foodType: z.string().trim().min(2, "Food type is required"),
    imageUrl: z.string().url("Invalid image URL").optional(),
    videoUrl: z.string().url("Invalid video URL").optional(),
});
export const rejectRecipeSchema = z.object({
    reason: z.string()
        .trim()
        .min(10, "Rejection reason must be at least 10 characters"),
});
//# sourceMappingURL=recipe.schema.js.map