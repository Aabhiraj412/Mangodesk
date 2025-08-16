#!/bin/bash

echo "🚀 MangoDesk AI Meeting Summarizer - Status Check"
echo "================================================"

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Please run this script from the Backend directory"
    exit 1
fi

# Check environment variables
echo "🔧 Checking Configuration..."

if [[ -f ".env" ]]; then
    echo "✅ .env file exists"
    
    if grep -q "GROQ_API_KEY=gsk_" .env; then
        echo "✅ Groq API key is configured"
    else
        echo "⚠️  Groq API key needs to be set for AI summarization"
    fi
    
    if grep -q "EMAIL_USER=.*@" .env; then
        echo "✅ Email service is configured"
    else
        echo "⚠️  Email service needs to be configured for sharing summaries"
    fi
else
    echo "❌ .env file missing"
    exit 1
fi

# Check dependencies
echo ""
echo "📦 Checking Dependencies..."
if [[ -d "node_modules" ]]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies missing. Run: bun install"
    exit 1
fi

echo ""
echo "🎯 All Systems Ready!"
echo ""
echo "To start the application:"
echo "1. Backend:  bun server.js"
echo "2. Frontend: cd ../Frontend && bun run dev"
echo ""
echo "Then visit: http://localhost:5173"
