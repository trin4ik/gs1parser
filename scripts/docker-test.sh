#!/bin/bash

echo "🚀 Running GS1 Parser tests in Docker..."

# Run tests using docker-compose
docker compose run --rm gs1parser sh -c "
  npm install &&
  npm run build &&
  npm test
"

echo "✅ Tests completed!"
