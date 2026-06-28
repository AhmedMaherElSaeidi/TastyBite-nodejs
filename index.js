import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { launchDBConnection } from "./config/db.js";
import bodyParser from "body-parser";
import morgan from "morgan";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Global Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
if (app.get("env") === "development") app.use(morgan("tiny"));

// routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import categoryRoutes from "./routes/category.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

launchDBConnection();
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
