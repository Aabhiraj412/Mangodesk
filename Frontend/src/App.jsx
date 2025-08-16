import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./Components/Home.jsx";
import { ENV } from "./utils/environment.js";

const App = () => {
	// Listen for dark mode changes and update document class
	useEffect(() => {
		const updateDarkModeClass = () => {
			const isDark =
				localStorage.getItem("darkMode") === "true" ||
				(!localStorage.getItem("darkMode") &&
					window.matchMedia("(prefers-color-scheme: dark)").matches);

			if (isDark) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		};

		updateDarkModeClass();

		// Listen for storage changes (dark mode toggle)
		const handleStorageChange = (e) => {
			if (e.key === "darkMode") {
				updateDarkModeClass();
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	return (
		<div>
			<Toaster
				position="top-right"
				toastOptions={{
					duration: ENV.isDevelopment ? 4000 : 3000,
					style: {
						background: "#363636",
						color: "#fff",
					},
					success: {
						duration: 3000,
						theme: {
							primary: "#4aed88",
						},
					},
				}}
			/>

			<Routes>
				<Route path="/" element={<Home />} />
				{/* Add more routes as needed */}
				{/* Example: <Route path="/about" element={<About />} /> */}
			</Routes>
		</div>
	);
};

export default App;
