#!/bin/bash

echo "🔨 Building GS1 Parser in Docker..."

# Build the project using docker-compose
docker compose run --rm gs1parser sh -c "
  npm install &&
  npm run build
"

echo "✅ Build completed! Check the dist/ folder."
