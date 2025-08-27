#!/bin/bash

echo "🚀 Publishing GS1 Parser to NPM..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Are you in the right directory?"
  exit 1
fi

# Build the project
echo "📦 Building project..."
docker run --rm -v "$(pwd):/app" -w /app node:20-alpine sh -c "
  npm install &&
  npm run build
"

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
docker run --rm -v "$(pwd):/app" -w /app node:20-alpine sh -c "
  npm install &&
  npm test
"

if [ $? -ne 0 ]; then
  echo "❌ Tests failed!"
  exit 1
fi

# Check if dist/ exists
if [ ! -d "dist" ]; then
  echo "❌ Error: dist/ directory not found. Build failed!"
  exit 1
fi

# Check if user is logged in to npm
echo "🔐 Checking NPM login status..."
docker run --rm -v "$(pwd):/app" -w /app node:20-alpine sh -c "npm whoami" 2>/dev/null

if [ $? -ne 0 ]; then
  echo "❌ Not logged in to NPM. Please run 'npm login' first."
  exit 1
fi

# Publish
echo "📤 Publishing to NPM..."
docker run --rm -v "$(pwd):/app" -w /app node:20-alpine sh -c "npm publish"

if [ $? -eq 0 ]; then
  echo "✅ Successfully published to NPM!"
else
  echo "❌ Failed to publish to NPM!"
  exit 1
fi

