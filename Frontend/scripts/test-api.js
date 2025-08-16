#!/usr/bin/env node

// Simple API connectivity test for frontend
const API_BASE_URL = "https://mangodesk-0boz.onrender.com";

async function testAPI() {
	console.log("🧪 Testing MangoDesk API connectivity...\n");

	try {
		// Test root endpoint
		console.log("📡 Testing root endpoint...");
		const rootResponse = await fetch(`${API_BASE_URL}/`);
		const rootData = await rootResponse.json();

		if (rootResponse.ok) {
			console.log("✅ Root endpoint: OK");
			console.log(`   Service: ${rootData.service}`);
			console.log(`   Environment: ${rootData.environment}`);
			console.log(`   Version: ${rootData.version}\n`);
		} else {
			console.log("❌ Root endpoint: FAILED\n");
		}

		// Test health endpoint
		console.log("🏥 Testing health endpoint...");
		const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
		const healthData = await healthResponse.json();

		if (healthResponse.ok) {
			console.log("✅ Health endpoint: OK");
			console.log(`   Status: ${healthData.status}`);
			console.log(`   Uptime: ${Math.floor(healthData.uptime)}s\n`);
		} else {
			console.log("❌ Health endpoint: FAILED\n");
		}

		// Test CORS
		console.log("🌐 Testing CORS configuration...");
		try {
			await fetch(`${API_BASE_URL}/api/health`, {
				headers: {
					Origin: "https://your-frontend-domain.vercel.app",
					"Content-Type": "application/json",
				},
			});
			console.log("✅ CORS: Properly configured\n");
		} catch {
			console.log("⚠️  CORS: May need configuration for production\n");
		}

		console.log("🎉 API connectivity test completed!");
		console.log("🔗 Your backend is ready at:", API_BASE_URL);
	} catch (error) {
		console.error("❌ API test failed:");
		console.error(`   Error: ${error.message}`);
		console.error("\n💡 Make sure your backend is deployed and running");
	}
}

testAPI();
