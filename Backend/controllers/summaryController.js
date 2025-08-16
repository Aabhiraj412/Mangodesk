import Summary from "../models/Summary.js";
import { generateSummary } from "../utils/aiService.js";
import { sendSummaryEmail } from "../utils/emailService.js";

// Generate AI summary from transcript
export const createSummary = async (req, res) => {
	try {
		const { originalText, customPrompt } = req.body;

		// Validate input
		if (!originalText || !customPrompt) {
			return res.status(400).json({
				success: false,
				message: "Both originalText and customPrompt are required",
			});
		}

		if (originalText.length > 50000) {
			return res.status(400).json({
				success: false,
				message:
					"Original text is too long. Maximum 50,000 characters allowed.",
			});
		}

		// Generate AI summary
		const aiSummary = await generateSummary(originalText, customPrompt);

		// Save to database
		const summary = new Summary({
			originalText,
			customPrompt,
			aiSummary,
			editedSummary: aiSummary, // Initially same as AI summary
		});

		await summary.save();

		res.status(201).json({
			success: true,
			message: "Summary generated successfully",
			data: {
				id: summary._id,
				aiSummary: summary.aiSummary,
				editedSummary: summary.editedSummary,
				createdAt: summary.createdAt,
			},
		});
	} catch (error) {
		console.error("Error creating summary:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// Update edited summary
export const updateSummary = async (req, res) => {
	try {
		const { id } = req.params;
		const { editedSummary } = req.body;

		if (!editedSummary) {
			return res.status(400).json({
				success: false,
				message: "Edited summary is required",
			});
		}

		const summary = await Summary.findByIdAndUpdate(
			id,
			{ editedSummary, updatedAt: Date.now() },
			{ new: true, runValidators: true }
		);

		if (!summary) {
			return res.status(404).json({
				success: false,
				message: "Summary not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Summary updated successfully",
			data: {
				id: summary._id,
				editedSummary: summary.editedSummary,
				updatedAt: summary.updatedAt,
			},
		});
	} catch (error) {
		console.error("Error updating summary:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// Share summary via email
export const shareSummary = async (req, res) => {
	try {
		const { id } = req.params;
		const { emails, subject } = req.body;

		if (!emails || !Array.isArray(emails) || emails.length === 0) {
			return res.status(400).json({
				success: false,
				message: "At least one email address is required",
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const invalidEmails = emails.filter((email) => !emailRegex.test(email));

		if (invalidEmails.length > 0) {
			return res.status(400).json({
				success: false,
				message: `Invalid email addresses: ${invalidEmails.join(", ")}`,
			});
		}

		const summary = await Summary.findById(id);

		if (!summary) {
			return res.status(404).json({
				success: false,
				message: "Summary not found",
			});
		}

		// Use edited summary if available, otherwise use AI summary
		const summaryToShare = summary.editedSummary || summary.aiSummary;

		// Send email
		const emailResult = await sendSummaryEmail(
			emails,
			summaryToShare,
			subject || "Meeting Summary"
		);

		// Update summary with shared information
		const sharedEntries = emails.map((email) => ({
			email,
			sharedAt: new Date(),
		}));

		summary.sharedWith.push(...sharedEntries);
		await summary.save();

		res.status(200).json({
			success: true,
			message: "Summary shared successfully",
			data: {
				messageId: emailResult.messageId,
				recipients: emailResult.recipients,
				sharedAt: new Date(),
			},
		});
	} catch (error) {
		console.error("Error sharing summary:", error);
		res.status(500).json({
			success: false,
			message: "Failed to share summary",
			error: error.message,
		});
	}
};

// Get summary by ID
export const getSummary = async (req, res) => {
	try {
		const { id } = req.params;

		const summary = await Summary.findById(id);

		if (!summary) {
			return res.status(404).json({
				success: false,
				message: "Summary not found",
			});
		}

		res.status(200).json({
			success: true,
			data: summary,
		});
	} catch (error) {
		console.error("Error fetching summary:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// Get all summaries (for admin/history purposes)
export const getAllSummaries = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const summaries = await Summary.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select("-originalText"); // Exclude original text for performance

		const total = await Summary.countDocuments();

		res.status(200).json({
			success: true,
			data: {
				summaries,
				pagination: {
					current: page,
					pages: Math.ceil(total / limit),
					total,
				},
			},
		});
	} catch (error) {
		console.error("Error fetching summaries:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

export default {
	createSummary,
	updateSummary,
	shareSummary,
	getSummary,
	getAllSummaries,
};
