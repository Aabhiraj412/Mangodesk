import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
	originalText: {
		type: String,
		required: true,
		maxlength: 50000, // Limit original text size
	},
	customPrompt: {
		type: String,
		required: true,
		maxlength: 1000,
	},
	aiSummary: {
		type: String,
		required: true,
		maxlength: 10000,
	},
	editedSummary: {
		type: String,
		maxlength: 10000,
	},
	sharedWith: [
		{
			email: String,
			sharedAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Update the updatedAt field before saving
summarySchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

const Summary = mongoose.model("Summary", summarySchema);

export default Summary;
