import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import ConnectDB from "./database/DB.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import { handleUploadError } from "./middlewares/uploadMiddleware.js";

dotenv.config();

const Port = process.env.PORT || 5000;
const app = express();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration - more permissive for production
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
		message: "AI-Powered Meeting Notes Summarizer API is running!",
		timestamp: new Date().toISOString(),
		version: process.env.VERSION || "1.0.0",
	});
});

// API Routes
app.use("/api/summaries", summaryRoutes);

// Serve static files from Frontend dist directory in production
if (process.env.NODE_ENV === "production") {
	const frontendDistPath = path.join(__dirname, "../Frontend/dist");
	app.use(express.static(frontendDistPath));

	// Handle specific React routes
	app.get("/dashboard", (req, res) => {
		res.sendFile(path.join(frontendDistPath, "index.html"));
	});

	app.get("/summary/:id", (req, res) => {
		res.sendFile(path.join(frontendDistPath, "index.html"));
	});

	// Handle root route in production
	app.get("/", (req, res) => {
		res.sendFile(path.join(frontendDistPath, "index.html"));
	});
} else {
	// Development mode - show development message for root only
	app.get("/", (req, res) => {
		res.json({
			message: "AI-Powered Meeting Notes Summarizer API",
			mode: "Development",
			frontend:
				"Run 'npm run dev' from root directory to start both frontend and backend",
			api_health: `http://localhost:${Port}/api/health`,
		});
	});
}

// Upload error handling middleware
app.use(handleUploadError);

// Global error handling middleware
app.use((error, req, res, next) => {
	console.error("Global error handler:", error);
	res.status(500).json({
		success: false,
		message: "Something went wrong!",
		error:
			process.env.NODE_ENV === "development"
				? error.message
				: "Internal server error",
	});
});

app.listen(Port, () => {
	console.log(`🚀 Server is running on port ${Port}`);
	console.log(`📋 API Health Check: http://localhost:${Port}/api/health`);
	if (process.env.NODE_ENV === "production") {
		console.log(`🌐 Full Application: http://localhost:${Port}`);
	} else {
		console.log(
			`💻 Development mode: Frontend runs separately on port 5173`
		);
	}
	ConnectDB();
});
