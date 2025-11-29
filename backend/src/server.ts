import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "./config/config";
import authRoutes from "./routes/authRoutes";
import formRoutes from "./routes/formRoutes";
import publicRoutes from "./routes/publicRoutes";
import submissionRoutes from "./routes/submissionRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import { authenticate } from "./middleware/auth";

const app = express();

app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/forms", authenticate, formRoutes);              // <-- FIXED
app.use("/api/public", publicRoutes);
app.use("/api/submissions", authenticate, submissionRoutes);  // <-- FIXED
app.use("/api/upload", authenticate, uploadRoutes);           // <-- FIXED

const startServer = async () => {
    try {
        await mongoose.connect(config.mongodbUri);
        console.log("✅ Connected to MongoDB");
        console.log("⚠️ Pinecone disabled — using local vector search");

        app.listen(config.port, () => {
            console.log(`🚀 Server running on port ${config.port}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
