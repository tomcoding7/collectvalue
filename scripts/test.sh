#!/bin/bash

echo "🧪 Running Test-Driven Development (TDD) for Collectors App"
echo "=========================================================="

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run tests with coverage
echo "🔍 Running unit tests..."
npm test -- --coverage --watchAll=false

# Run specific test suites
echo "🔍 Running component tests..."
npm test -- __tests__/components --watchAll=false

echo "🔍 Running service tests..."
npm test -- __tests__/services --watchAll=false

echo "🔍 Running integration tests..."
npm test -- __tests__/integration --watchAll=false

echo "✅ All tests completed!"
echo "📊 Check the coverage report above for details."



