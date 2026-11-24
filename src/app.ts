
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// Middleware 
app.use(express.json());

// Routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/upload", uploadRoutes);


export default app;
