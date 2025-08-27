#!/bin/bash

echo "🚀 Running GS1 Parser examples in Docker..."

# Run examples using docker-compose
docker compose run --rm gs1parser sh -c "
  npm install &&
  npm run build &&
  node examples/basic-usage.js
"

echo "✅ Examples completed!"
