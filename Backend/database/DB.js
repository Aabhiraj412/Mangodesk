import mongoose from "mongoose";

const ConnectDB = async () => {
	try {
		await mongoose.connect(process.env.MongoDB_URI);
		console.log("✅ MongoDB connected successfully");
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error);
		process.exit(1);
	}
};

export default ConnectDB;
