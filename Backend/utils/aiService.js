import Groq from "groq-sdk";

// Initialize Groq client only if API key is available
let groq = null;

const initializeGroq = () => {
	if (
		process.env.GROQ_API_KEY &&
		process.env.GROQ_API_KEY !== "your_groq_api_key_here"
	) {
		try {
			groq = new Groq({
				apiKey: process.env.GROQ_API_KEY,
			});
			return true;
		} catch (error) {
			console.error("Failed to initialize Groq client:", error);
			return false;
		}
	}
	return false;
};

export const generateSummary = async (originalText, customPrompt) => {
	// Check if Groq is available
	if (!groq && !initializeGroq()) {
		console.warn(
			"Groq API key not configured. Using fallback summary generation."
		);
		return generateFallbackSummary(originalText, customPrompt);
	}

	try {
		const systemPrompt = `You are an expert AI assistant specialized in creating professional meeting summaries and structured notes. Your goal is to transform meeting transcripts into clear, actionable summaries.

Core Responsibilities:
- Analyze meeting content and extract key information
- Create well-organized, professional summaries
- Identify and highlight important decisions and action items
- Ensure clarity and readability for business stakeholders

Formatting Requirements:
- ALWAYS use proper Markdown formatting
- Use descriptive headers (## for main sections, ### for subsections)
- Use bullet points (-) for lists and key points
- Use **bold** for important items like decisions and action items
- Use *italics* for context or notes
- Keep paragraphs concise (2-3 sentences max)

Structure Guidelines:
- Start with a brief overview/executive summary
- Organize content into logical sections (Discussion Points, Key Decisions, Action Items, etc.)
- Include participant names when mentioned
- Highlight deadlines and timelines
- End with clear next steps if applicable

Quality Standards:
- Professional business language
- Concise yet comprehensive
- Focus on actionable outcomes
- Maintain original context and meaning
- Remove filler words and tangential discussions`;

		const userPrompt = `Meeting Transcript:
${originalText}

Specific Instructions:
${customPrompt}

Please create a professional summary following the formatting requirements and structure guidelines above. Focus on the specific instructions provided while maintaining clarity and completeness.`;

		const completion = await groq.chat.completions.create({
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
			model: "llama3-8b-8192", // Using Llama 3 8B model
			temperature: 0.3,
			max_tokens: 2000,
			top_p: 1,
			stream: false,
			stop: null,
		});

		return (
			completion.choices[0]?.message?.content ||
			"Unable to generate summary"
		);
	} catch (error) {
		console.error("Error generating summary with Groq:", error);

		// Fallback basic summary if AI service fails
		const fallbackSummary = generateFallbackSummary(
			originalText,
			customPrompt
		);
		return fallbackSummary;
	}
};

// Fallback summary generation in case AI service fails
const generateFallbackSummary = (originalText, customPrompt) => {
	const words = originalText.split(/\s+/);
	const sentences = originalText
		.split(/[.!?]+/)
		.filter((s) => s.trim().length > 0);

	let summary = `## Meeting Summary\n\n`;
	summary += `*Generated based on: ${customPrompt}*\n\n`;

	summary += `### Key Points\n\n`;

	// Take first few sentences as basic summary
	const summaryLength = Math.min(4, sentences.length);
	for (let i = 0; i < summaryLength; i++) {
		if (sentences[i].trim()) {
			summary += `- ${sentences[i].trim()}\n`;
		}
	}

	summary += `\n### Document Information\n\n`;
	summary += `- **Word Count:** ${words.length} words\n`;
	summary += `- **Estimated Reading Time:** ${Math.ceil(
		words.length / 200
	)} minutes\n`;
	summary += `- **Generated:** ${new Date().toLocaleString()}\n`;

	// Check if API key is missing
	if (
		!process.env.GROQ_API_KEY ||
		process.env.GROQ_API_KEY === "your_groq_api_key_here"
	) {
		summary += `\n### ⚠️ Notice\n\n`;
		summary += `AI summarization is currently disabled. To enable advanced AI-powered summaries:\n\n`;
		summary += `1. Get your free API key from [Groq Console](https://console.groq.com/)\n`;
		summary += `2. Add it to your .env file as GROQ_API_KEY\n`;
		summary += `3. Restart the application\n\n`;
		summary += `*This is a basic fallback summary with limited functionality.*`;
	} else {
		summary += `\n### 🔧 Technical Note\n\n`;
		summary += `*This is a basic summary generated due to AI service unavailability. Full AI features will return shortly.*`;
	}

	return summary;
};

export default { generateSummary };
