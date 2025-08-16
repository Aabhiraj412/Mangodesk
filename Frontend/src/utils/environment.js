// Environment and configuration utilities
export const ENV = {
	isDevelopment: import.meta.env.DEV,
	isProduction: import.meta.env.PROD,
	apiBaseURL:
		import.meta.env.VITE_API_BASE_URL ||
		(import.meta.env.PROD
			? "https://mangodesk-0boz.onrender.com/api"
			: "http://localhost:5000/api"),
	appName: import.meta.env.VITE_APP_NAME || "MangoDesk AI Summarizer",
	appVersion: import.meta.env.VITE_APP_VERSION || "1.1.0",
	defaultTheme: import.meta.env.VITE_DEFAULT_THEME || "light",
	enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === "true",
	debugMode: import.meta.env.VITE_DEBUG_MODE === "true",
};

// Conditional logging for production
export const logger = {
	info: (...args) => {
		if (ENV.isDevelopment || ENV.debugMode) {
			console.log("[INFO]", ...args);
		}
	},
	warn: (...args) => {
		if (ENV.isDevelopment || ENV.debugMode) {
			console.warn("[WARN]", ...args);
		}
	},
	error: (...args) => {
		console.error("[ERROR]", ...args);
	},
	debug: (...args) => {
		if (ENV.debugMode) {
			console.debug("[DEBUG]", ...args);
		}
	},
};

// API status checker
export const checkAPIStatus = async () => {
	try {
		const response = await fetch(`${ENV.apiBaseURL}/health`);
		return response.ok;
	} catch {
		return false;
	}
};

export default { ENV, logger, checkAPIStatus };
