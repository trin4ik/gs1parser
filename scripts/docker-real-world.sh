#!/bin/bash

echo "🌍 Running GS1 Parser real-world examples in Docker..."

# Run real-world examples using docker-compose
docker compose run --rm gs1parser sh -c "
  npm install &&
  npm run build &&
  node examples/real-world.js
"

echo "✅ Real-world examples completed!"

