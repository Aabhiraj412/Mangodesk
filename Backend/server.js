import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import ConnectDB from "./database/DB.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import { handleUploadError } from "./middlewares/uploadMiddleware.js";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MongoDB_URI', 'GROQ_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
	console.error("❌ Missing required environment variables:", missingEnvVars.join(', '));
	if (process.env.NODE_ENV === "production") {
		process.exit(1);
	}
} else {
	console.log("✅ All required environment variables are configured");
}

const Port = process.env.PORT || 5000;
const app = express();

const corsOptions = {
	origin:
		process.env.NODE_ENV === "production"
			? true
			: process.env.FRONTEND_URL || "http://localhost:5173",
	credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({
		status: "healthy",
		service: "MangoDesk AI Summarizer API",
		version: process.env.VERSION || "1.0.0",
		environment: process.env.NODE_ENV || "development",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		memory: {
			used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
			total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
		}
	});
});

// API Routes
app.use("/api/summaries", summaryRoutes);

// Development and production API endpoint
app.get("/", (req, res) => {
	res.json({
		service: "MangoDesk AI Summarizer API",
		version: process.env.VERSION || "1.0.0",
		status: "active",
		environment: process.env.NODE_ENV || "development",
		endpoints: {
			health: "/api/health",
			summaries: "/api/summaries"
		},
		timestamp: new Date().toISOString()
	});
});

// Upload error handling middleware
app.use(handleUploadError);

// Global error handling middleware
app.use((error, req, res, next) => {
	const timestamp = new Date().toISOString();
	console.error(`❌ [${timestamp}] Global Error:`, error.message);
	
	if (process.env.NODE_ENV === "development") {
		console.error("Stack trace:", error.stack);
	}
	
	res.status(500).json({
		success: false,
		message: "Internal server error occurred",
		timestamp,
		...(process.env.NODE_ENV === "development" && {
			error: error.message,
			stack: error.stack
		})
	});
});

app.listen(Port, () => {
	console.log(`🚀 MangoDesk API Server running on port ${Port}`);
	console.log(`📋 Health Check: /api/health`);
	console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
	console.log(`⚡ Server started at ${new Date().toISOString()}`);
	ConnectDB();
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
	console.log('🛑 SIGTERM received, shutting down gracefully...');
	process.exit(0);
});

process.on('SIGINT', () => {
	console.log('🛑 SIGINT received, shutting down gracefully...');
	process.exit(0);
});
