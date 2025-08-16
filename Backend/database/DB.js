import mongoose from "mongoose";

const ConnectDB = async () => {
	try {
		await mongoose.connect(process.env.MongoDB_URI);
		console.log("✅ Database connected successfully");
		console.log(
			`📊 MongoDB URI: ${
				process.env.MongoDB_URI ? "configured" : "missing"
			}`
		);
	} catch (error) {
		console.error("❌ Database connection failed");
		console.error(`🔍 Error details: ${error.message}`);
		if (process.env.NODE_ENV === "development") {
			console.error("Full error:", error);
		}
		process.exit(1);
	}
};

export default ConnectDB;
