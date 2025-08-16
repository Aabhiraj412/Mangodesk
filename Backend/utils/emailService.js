import nodemailer from "nodemailer";

// Convert markdown to clean plain text
const markdownToPlainText = (markdown) => {
	return (
		markdown
			// Remove markdown headers (# ## ###)
			.replace(/^#{1,6}\s+/gm, "")
			// Remove bold/italic markers (**text** or *text*)
			.replace(/\*\*([^*]+)\*\*/g, "$1")
			.replace(/\*([^*]+)\*/g, "$1")
			// Remove inline code markers (`code`)
			.replace(/`([^`]+)`/g, "$1")
			// Convert bullet points (- or *) to clean bullets
			.replace(/^[\s]*[-*]\s+/gm, "• ")
			// Clean up multiple newlines
			.replace(/\n\s*\n/g, "\n\n")
			// Trim whitespace
			.trim()
	);
};

// Create transporter using environment variables
const createTransporter = () => {
	return nodemailer.createTransport({
		service: "gmail", // You can change this to your preferred email service
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS, // Use app password for Gmail
		},
	});
};

export const sendSummaryEmail = async (
	recipientEmails,
	summary,
	subject = "Meeting Summary"
) => {
	try {
		const transporter = createTransporter();

		// Verify transporter configuration
		await transporter.verify();

		// Convert markdown summary to clean plain text
		const cleanSummary = markdownToPlainText(summary);

		const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Meeting Summary</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f9fa; }
                .container { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }
                .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
                .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; }
                .content { padding: 30px; }
                .summary { background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #4f46e5; margin: 20px 0; }
                .summary-text { font-size: 16px; line-height: 1.8; color: #374151; white-space: pre-line; }
                .footer { text-align: center; padding: 20px; background: #f1f5f9; color: #64748b; font-size: 14px; }
                .footer strong { color: #475569; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📋 Meeting Summary</h1>
                    <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                </div>
                <div class="content">
                    <div class="summary">
                        <div class="summary-text">${cleanSummary}</div>
                    </div>
                </div>
                <div class="footer">
                    <p><strong>AI-Powered Meeting Notes Summarizer</strong></p>
                    <p>� Powered by MangoDesk • Built with MERN Stack & Groq AI</p>
                </div>
            </div>
        </body>
        </html>
        `;

		// Send email to multiple recipients
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: recipientEmails.join(", "),
			subject: subject,
			html: emailHtml,
			text: `Meeting Summary\n\nGenerated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n${cleanSummary}\n\n---\nAI-Powered Meeting Notes Summarizer\nPowered by MangoDesk • Built with MERN Stack & Groq AI`,
		};

		const info = await transporter.sendMail(mailOptions);

		return {
			success: true,
			messageId: info.messageId,
			recipients: recipientEmails,
		};
	} catch (error) {
		console.error("Error sending email:", error);
		throw new Error(`Failed to send email: ${error.message}`);
	}
};

// Test email configuration
export const testEmailConfig = async () => {
	try {
		const transporter = createTransporter();
		await transporter.verify();
		return { success: true, message: "Email configuration is valid" };
	} catch (error) {
		return { success: false, message: error.message };
	}
};

export default { sendSummaryEmail, testEmailConfig };
