#!/bin/bash

# Vercel Build Script for MangoDesk AI Summarizer
echo "🚀 Starting Vercel build process..."

# Navigate to Frontend directory and install dependencies
echo "📦 Installing Frontend dependencies..."
cd Frontend || exit 1
bun install

# Build the frontend
echo "🔨 Building Frontend..."
bun run build

echo "✅ Build completed successfully!"
