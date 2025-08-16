#!/usr/bin/env node

import fetch from "node-fetch";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

async function checkDeploymentHealth() {
	console.log("🔍 Checking MangoDesk API deployment status...\n");

	try {
		// Check root endpoint
		const rootResponse = await fetch(`${API_BASE_URL}/`);
		const rootData = await rootResponse.json();

		console.log("✅ Root endpoint:", rootResponse.ok ? "OK" : "FAILED");
		console.log(`   Service: ${rootData.service}`);
		console.log(`   Version: ${rootData.version}`);
		console.log(`   Environment: ${rootData.environment}\n`);

		// Check health endpoint
		const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
		const healthData = await healthResponse.json();

		console.log("✅ Health endpoint:", healthResponse.ok ? "OK" : "FAILED");
		console.log(`   Status: ${healthData.status}`);
		console.log(`   Uptime: ${Math.floor(healthData.uptime)}s`);
		console.log(
			`   Memory: ${healthData.memory.used}MB / ${healthData.memory.total}MB\n`
		);

		console.log("🚀 Deployment check completed successfully!");
	} catch (error) {
		console.error("❌ Deployment check failed:");
		console.error(`   Error: ${error.message}`);
		process.exit(1);
	}
}

checkDeploymentHealth();
