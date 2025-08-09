#!/bin/bash

echo "🚀 Starting Collectors App in Development Mode"
echo "=============================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Creating from example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Created .env from env.example"
    else
        echo "❌ env.example not found. Please create a .env file manually."
        exit 1
    fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clear cache and start
echo "🧹 Clearing Expo cache..."
npx expo start --clear

echo "✅ Development server started!"
echo "📱 Scan the QR code with Expo Go app"
echo "🔧 Using Mock API for development (no backend required)"



