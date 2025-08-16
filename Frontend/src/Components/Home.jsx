import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { summaryAPI } from "../services/api.js";

const Home = () => {
	const [originalText, setOriginalText] = useState("");
	const [customPrompt, setCustomPrompt] = useState("");
	const [aiSummary, setAiSummary] = useState("");
	const [editedSummary, setEditedSummary] = useState("");
	const [summaryId, setSummaryId] = useState("");
	const [loading, setLoading] = useState(false);
	const [emailAddresses, setEmailAddresses] = useState("");
	const [emailSubject, setEmailSubject] = useState("Meeting Summary");
	const [sharing, setSharing] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Check for saved dark mode preference or system preference
	useEffect(() => {
		const savedTheme = localStorage.getItem("darkMode");
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		setIsDarkMode(savedTheme ? JSON.parse(savedTheme) : prefersDark);
	}, []);

	// Update document class when dark mode changes
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	// Toggle dark mode
	const toggleDarkMode = () => {
		const newDarkMode = !isDarkMode;
		setIsDarkMode(newDarkMode);
		localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
	};

	// Handle file upload
	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setOriginalText(e.target.result);
				toast.success("File uploaded successfully!");
			};
			reader.readAsText(file);
		}
	};

	// Generate AI summary
	const handleGenerateSummary = async () => {
		if (!originalText.trim()) {
			toast.error("Please enter or upload the meeting transcript");
			return;
		}

		if (!customPrompt.trim()) {
			toast.error("Please enter custom instructions");
			return;
		}

		setLoading(true);
		try {
			const response = await summaryAPI.generateSummary(
				originalText,
				customPrompt
			);

			if (response.success) {
				setAiSummary(response.data.aiSummary);
				setEditedSummary(response.data.editedSummary);
				setSummaryId(response.data.id);
				toast.success("Summary generated successfully!");
			}
		} catch (error) {
			toast.error(error.message || "Failed to generate summary");
		} finally {
			setLoading(false);
		}
	};

	// Update summary
	const handleUpdateSummary = async () => {
		if (!summaryId || !editedSummary.trim()) {
			toast.error("No summary to update");
			return;
		}

		try {
			const response = await summaryAPI.updateSummary(
				summaryId,
				editedSummary
			);

			if (response.success) {
				toast.success("Summary updated successfully!");
				// Update the AI summary display to show the edited version
				setAiSummary(editedSummary);
			}
		} catch (error) {
			toast.error(error.message || "Failed to update summary");
		}
	};

	// Share summary via email
	const handleShareSummary = async () => {
		if (!summaryId) {
			toast.error("No summary to share");
			return;
		}

		if (!emailAddresses.trim()) {
			toast.error("Please enter email addresses");
			return;
		}

		// Parse and validate email addresses
		const emails = emailAddresses
			.split(/[,;\n]/)
			.map((email) => email.trim())
			.filter((email) => email.length > 0);

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const invalidEmails = emails.filter((email) => !emailRegex.test(email));

		if (emails.length === 0) {
			toast.error("Please enter valid email addresses");
			return;
		}

		if (invalidEmails.length > 0) {
			toast.error(`Invalid email format: ${invalidEmails.join(", ")}`);
			return;
		}

		setSharing(true);
		try {
			const response = await summaryAPI.shareSummary(
				summaryId,
				emails,
				emailSubject
			);

			if (response.success) {
				toast.success(
					`Summary shared with ${emails.length} recipient(s)!`
				);
				setEmailAddresses("");
			}
		} catch (error) {
			toast.error(error.message || "Failed to share summary");
		} finally {
			setSharing(false);
		}
	};

	// Reset form
	const handleReset = () => {
		setOriginalText("");
		setCustomPrompt("");
		setAiSummary("");
		setEditedSummary("");
		setSummaryId("");
		setEmailAddresses("");
		setEmailSubject("Meeting Summary");
		toast.success("Form reset successfully!");
	};

	return (
		<div
			className={`min-h-screen transition-colors duration-200 ${
				isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
			}`}
		>
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* Dark Mode Toggle */}
				<div className="flex justify-end mb-4">
					<button
						onClick={toggleDarkMode}
						className={`p-2 rounded-lg transition-colors ${
							isDarkMode
								? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
								: "bg-white text-gray-600 hover:bg-gray-100"
						} shadow-sm border ${
							isDarkMode ? "border-gray-700" : "border-gray-200"
						}`}
						title={`Switch to ${
							isDarkMode ? "light" : "dark"
						} mode`}
					>
						{isDarkMode ? "☀️" : "🌙"}
					</button>
				</div>

				{/* Header */}
				<header className="text-center mb-12">
					<h1
						className={`text-4xl font-bold mb-4 ${
							isDarkMode ? "text-white" : "text-gray-900"
						}`}
					>
						🎯 AI-Powered Meeting Notes Summarizer
					</h1>
					<p
						className={`text-xl max-w-3xl mx-auto ${
							isDarkMode ? "text-gray-300" : "text-gray-600"
						}`}
					>
						Upload your meeting transcripts, add custom
						instructions, and get structured summaries that you can
						edit and share via email.
					</p>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Left Column - Input Section */}
					<div className="space-y-6">
						{/* File Upload Section */}
						<div
							className={`rounded-xl shadow-sm border p-6 ${
								isDarkMode
									? "bg-gray-800 border-gray-700"
									: "bg-white border-gray-200"
							}`}
						>
							<h2
								className={`text-xl font-semibold mb-4 ${
									isDarkMode ? "text-white" : "text-gray-900"
								}`}
							>
								📄 Upload Transcript
							</h2>
							<div className="space-y-4">
								<input
									type="file"
									accept=".txt"
									onChange={handleFileUpload}
									className={`block w-full text-sm cursor-pointer
										file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
										file:text-sm file:font-medium
										${
											isDarkMode
												? "text-gray-300 file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
												: "text-gray-500 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
										}`}
								/>
								<p
									className={`text-sm ${
										isDarkMode
											? "text-gray-400"
											: "text-gray-500"
									}`}
								>
									Upload a .txt file containing your meeting
									transcript
								</p>
							</div>
						</div>

						{/* Text Input Section */}
						<div
							className={`rounded-xl shadow-sm border p-6 ${
								isDarkMode
									? "bg-gray-800 border-gray-700"
									: "bg-white border-gray-200"
							}`}
						>
							<h2
								className={`text-xl font-semibold mb-4 ${
									isDarkMode ? "text-white" : "text-gray-900"
								}`}
							>
								✏️ Meeting Transcript
							</h2>
							<textarea
								value={originalText}
								onChange={(e) =>
									setOriginalText(e.target.value)
								}
								placeholder="Paste your meeting transcript here or upload a file above..."
								className={`w-full h-48 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
									isDarkMode
										? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
										: "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
								}`}
								maxLength={50000}
							/>
							<p
								className={`text-sm mt-2 ${
									isDarkMode
										? "text-gray-400"
										: "text-gray-500"
								}`}
							>
								{originalText.length}/50,000 characters
							</p>
						</div>

						{/* Custom Prompt Section */}
						<div
							className={`rounded-xl shadow-sm border p-6 ${
								isDarkMode
									? "bg-gray-800 border-gray-700"
									: "bg-white border-gray-200"
							}`}
						>
							<h2
								className={`text-xl font-semibold mb-4 ${
									isDarkMode ? "text-white" : "text-gray-900"
								}`}
							>
								🎯 Custom Instructions
							</h2>
							<div className="space-y-3">
								<div className="flex flex-wrap gap-2">
									<button
										onClick={() =>
											setCustomPrompt(
												"Summarize the meeting in bullet points for executives"
											)
										}
										className={`px-3 py-1 text-xs rounded-full transition-colors ${
											isDarkMode
												? "bg-gray-700 hover:bg-gray-600 text-gray-200"
												: "bg-gray-100 hover:bg-gray-200 text-gray-700"
										}`}
									>
										Executive Summary
									</button>
									<button
										onClick={() =>
											setCustomPrompt(
												"Extract only the action items and who is responsible"
											)
										}
										className={`px-3 py-1 text-xs rounded-full transition-colors ${
											isDarkMode
												? "bg-gray-700 hover:bg-gray-600 text-gray-200"
												: "bg-gray-100 hover:bg-gray-200 text-gray-700"
										}`}
									>
										Action Items
									</button>
									<button
										onClick={() =>
											setCustomPrompt(
												"Create a detailed technical summary with key decisions"
											)
										}
										className={`px-3 py-1 text-xs rounded-full transition-colors ${
											isDarkMode
												? "bg-gray-700 hover:bg-gray-600 text-gray-200"
												: "bg-gray-100 hover:bg-gray-200 text-gray-700"
										}`}
									>
										Technical Summary
									</button>
								</div>
								<textarea
									value={customPrompt}
									onChange={(e) =>
										setCustomPrompt(e.target.value)
									}
									placeholder="E.g., 'Summarize in bullet points for executives' or 'Highlight only action items'"
									className={`w-full h-24 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
										isDarkMode
											? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
											: "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
									}`}
									maxLength={1000}
								/>
								<p
									className={`text-sm ${
										isDarkMode
											? "text-gray-400"
											: "text-gray-500"
									}`}
								>
									{customPrompt.length}/1,000 characters
								</p>
							</div>
						</div>

						{/* Generate Button */}
						<button
							onClick={handleGenerateSummary}
							disabled={
								loading ||
								!originalText.trim() ||
								!customPrompt.trim()
							}
							className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed 
								text-white font-semibold py-3 px-6 rounded-lg transition duration-200 
								flex items-center justify-center space-x-2"
						>
							{loading ? (
								<>
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
									<span>Generating Summary...</span>
								</>
							) : (
								<>
									<span>🤖</span>
									<span>Generate Summary</span>
								</>
							)}
						</button>
					</div>

					{/* Right Column - Output Section */}
					<div className="space-y-6">
						{/* AI Summary */}
						{aiSummary && (
							<div
								className={`rounded-xl shadow-sm border p-6 ${
									isDarkMode
										? "bg-gray-800 border-gray-700"
										: "bg-white border-gray-200"
								}`}
							>
								<h2
									className={`text-xl font-semibold mb-4 ${
										isDarkMode
											? "text-white"
											: "text-gray-900"
									}`}
								>
									🤖 AI Generated Summary
								</h2>
								<div
									className={`rounded-lg p-4 max-h-64 overflow-y-auto ${
										isDarkMode
											? "bg-gray-700"
											: "bg-gray-50"
									}`}
								>
									<div
										className={`prose prose-sm max-w-none ${
											isDarkMode ? "dark-markdown" : ""
										}`}
									>
										<style>{`
											.dark-markdown {
												color: #e5e7eb !important;
											}
											.dark-markdown h1,
											.dark-markdown h2,
											.dark-markdown h3,
											.dark-markdown h4,
											.dark-markdown h5,
											.dark-markdown h6 {
												color: #ffffff !important;
												font-weight: 600;
											}
											.dark-markdown p {
												color: #e5e7eb !important;
											}
											.dark-markdown strong,
											.dark-markdown b {
												color: #ffffff !important;
												font-weight: 700;
											}
											.dark-markdown li {
												color: #e5e7eb !important;
											}
											.dark-markdown ul,
											.dark-markdown ol {
												color: #e5e7eb !important;
											}
											.dark-markdown em,
											.dark-markdown i {
												color: #d1d5db !important;
											}
										`}</style>
										<ReactMarkdown>
											{aiSummary}
										</ReactMarkdown>
									</div>
								</div>
							</div>
						)}

						{/* Editable Summary */}
						{editedSummary && (
							<div
								className={`rounded-xl shadow-sm border p-6 ${
									isDarkMode
										? "bg-gray-800 border-gray-700"
										: "bg-white border-gray-200"
								}`}
							>
								<h2
									className={`text-xl font-semibold mb-4 ${
										isDarkMode
											? "text-white"
											: "text-gray-900"
									}`}
								>
									✏️ Edit Summary
								</h2>
								<textarea
									value={editedSummary}
									onChange={(e) =>
										setEditedSummary(e.target.value)
									}
									className={`w-full h-48 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
										isDarkMode
											? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
											: "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
									}`}
									maxLength={10000}
								/>
								<div className="flex justify-between items-center mt-3">
									<p
										className={`text-sm ${
											isDarkMode
												? "text-gray-400"
												: "text-gray-500"
										}`}
									>
										{editedSummary.length}/10,000 characters
									</p>
									<button
										onClick={handleUpdateSummary}
										className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
									>
										💾 Save Changes
									</button>
								</div>
							</div>
						)}

						{/* Email Sharing */}
						{summaryId && (
							<div
								className={`rounded-xl shadow-sm border p-6 ${
									isDarkMode
										? "bg-gray-800 border-gray-700"
										: "bg-white border-gray-200"
								}`}
							>
								<h2
									className={`text-xl font-semibold mb-4 ${
										isDarkMode
											? "text-white"
											: "text-gray-900"
									}`}
								>
									📧 Share Summary
								</h2>
								<div className="space-y-4">
									<div>
										<label
											className={`block text-sm font-medium mb-2 ${
												isDarkMode
													? "text-gray-300"
													: "text-gray-700"
											}`}
										>
											Email Subject
										</label>
										<input
											type="text"
											value={emailSubject}
											onChange={(e) =>
												setEmailSubject(e.target.value)
											}
											className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
												isDarkMode
													? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
													: "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
											}`}
											placeholder="Meeting Summary"
										/>
									</div>
									<div>
										<label
											className={`block text-sm font-medium mb-2 ${
												isDarkMode
													? "text-gray-300"
													: "text-gray-700"
											}`}
										>
											Recipient Email Addresses
										</label>
										<textarea
											value={emailAddresses}
											onChange={(e) =>
												setEmailAddresses(
													e.target.value
												)
											}
											placeholder="Enter email addresses separated by commas, semicolons, or new lines..."
											className={`w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
												isDarkMode
													? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
													: "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
											}`}
										/>
										<p
											className={`text-sm mt-1 ${
												isDarkMode
													? "text-gray-400"
													: "text-gray-500"
											}`}
										>
											Separate multiple email addresses
											with commas, semicolons, or new
											lines
										</p>
									</div>
									<button
										onClick={handleShareSummary}
										disabled={
											sharing || !emailAddresses.trim()
										}
										className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed 
											text-white font-semibold py-3 px-6 rounded-lg transition duration-200 
											flex items-center justify-center space-x-2"
									>
										{sharing ? (
											<>
												<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
												<span>Sending...</span>
											</>
										) : (
											<>
												<span>📤</span>
												<span>Share via Email</span>
											</>
										)}
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Reset Button */}
				{(originalText || customPrompt || aiSummary) && (
					<div className="mt-12 text-center">
						<button
							onClick={handleReset}
							className={`font-medium py-3 px-6 rounded-lg transition duration-200 ${
								isDarkMode
									? "bg-gray-700 hover:bg-gray-600 text-white"
									: "bg-gray-600 hover:bg-gray-700 text-white"
							}`}
						>
							🔄 Reset Form
						</button>
					</div>
				)}

				{/* Footer */}
				<footer className="mt-16 text-center">
					<p
						className={`text-sm ${
							isDarkMode ? "text-gray-400" : "text-gray-500"
						}`}
					>
						Built with ❤️ using MERN Stack • Powered by Groq AI •
						MangoDesk 2025
					</p>
				</footer>
			</div>
		</div>
	);
};

export default Home;
