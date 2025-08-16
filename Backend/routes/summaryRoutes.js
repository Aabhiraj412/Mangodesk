import express from "express";
import {
	createSummary,
	updateSummary,
	shareSummary,
	getSummary,
	getAllSummaries,
} from "../controllers/summaryController.js";

const router = express.Router();

// GET /api/summaries - Get all summaries (with pagination) - MUST be before /:id
router.get("/", getAllSummaries);

// POST /api/summaries - Generate AI summary from transcript
router.post("/", createSummary);

// POST /api/summaries/:id/share - Share summary via email (more specific route before /:id)
router.post("/:id/share", shareSummary);

// GET /api/summaries/:id - Get specific summary
router.get("/:id", getSummary);

// PUT /api/summaries/:id - Update edited summary
router.put("/:id", updateSummary);

export default router;
