import axios from "axios";
import { ENV, logger } from "../utils/environment.js";

// API Base URL - automatically adapts to environment
const API_BASE_URL = ENV.apiBaseURL;

// Create axios instance
const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000, // 30 seconds timeout for AI processing
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor
api.interceptors.request.use(
	(config) => {
		logger.debug("API Request:", config.method?.toUpperCase(), config.url);
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor
api.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		const errorMessage =
			error.response?.data?.message ||
			error.message ||
			"Something went wrong";
		logger.error("API Error:", errorMessage);
		return Promise.reject(new Error(errorMessage));
	}
);

// Summary API functions
export const summaryAPI = {
	// Generate AI summary
	generateSummary: async (originalText, customPrompt) => {
		const response = await api.post("/summaries", {
			originalText,
			customPrompt,
		});
		return response;
	},

	// Get summary by ID
	getSummary: async (id) => {
		const response = await api.get(`/summaries/${id}`);
		return response;
	},

	// Update edited summary
	updateSummary: async (id, editedSummary) => {
		const response = await api.put(`/summaries/${id}`, {
			editedSummary,
		});
		return response;
	},

	// Share summary via email
	shareSummary: async (id, emails, subject) => {
		const response = await api.post(`/summaries/${id}/share`, {
			emails,
			subject,
		});
		return response;
	},

	// Get all summaries
	getAllSummaries: async (page = 1, limit = 10) => {
		const response = await api.get(
			`/summaries?page=${page}&limit=${limit}`
		);
		return response;
	},
};

// Health check
export const healthCheck = async () => {
	return api.get("/health");
};

export default api;
