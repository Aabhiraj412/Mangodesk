import axios from "axios";

// API Base URL - automatically adapts to environment
const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ||
	(import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

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
		console.log("API Request:", config.method?.toUpperCase(), config.url);
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
		console.error("API Error:", errorMessage);
		return Promise.reject(new Error(errorMessage));
	}
);

// Summary API functions
export const summaryAPI = {
	// Generate AI summary
	generateSummary: async (originalText, customPrompt) => {
		try {
			const response = await api.post("/summaries", {
				originalText,
				customPrompt,
			});
			return response;
		} catch (error) {
			throw error;
		}
	},

	// Get summary by ID
	getSummary: async (id) => {
		try {
			const response = await api.get(`/summaries/${id}`);
			return response;
		} catch (error) {
			throw error;
		}
	},

	// Update edited summary
	updateSummary: async (id, editedSummary) => {
		try {
			const response = await api.put(`/summaries/${id}`, {
				editedSummary,
			});
			return response;
		} catch (error) {
			throw error;
		}
	},

	// Share summary via email
	shareSummary: async (id, emails, subject) => {
		try {
			const response = await api.post(`/summaries/${id}/share`, {
				emails,
				subject,
			});
			return response;
		} catch (error) {
			throw error;
		}
	},

	// Get all summaries
	getAllSummaries: async (page = 1, limit = 10) => {
		try {
			const response = await api.get(
				`/summaries?page=${page}&limit=${limit}`
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

// Health check
export const healthCheck = async () => {
	try {
		const response = await api.get("/health");
		return response;
	} catch (error) {
		throw error;
	}
};

export default api;
