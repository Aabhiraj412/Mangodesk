import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	// Accept only text files
	if (
		file.mimetype === "text/plain" ||
		file.mimetype === "application/txt" ||
		file.originalname.toLowerCase().endsWith(".txt")
	) {
		cb(null, true);
	} else {
		cb(new Error("Only text files are allowed!"), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
});

// Middleware to handle file upload and extract text
export const uploadMiddleware = upload.single("transcript");

export const handleFileUpload = (req, res, next) => {
	try {
		if (req.file) {
			// Convert buffer to string
			const text = req.file.buffer.toString("utf-8");
			req.body.originalText = text;
		}
		next();
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Error processing uploaded file",
			error: error.message,
		});
	}
};

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
	if (error instanceof multer.MulterError) {
		if (error.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({
				success: false,
				message: "File too large. Maximum size is 10MB.",
			});
		}
	} else if (error.message === "Only text files are allowed!") {
		return res.status(400).json({
			success: false,
			message: "Only text files (.txt) are allowed.",
		});
	}

	next(error);
};

export default {
	uploadMiddleware,
	handleFileUpload,
	handleUploadError,
};
