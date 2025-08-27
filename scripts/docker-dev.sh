#!/bin/bash

echo "🛠️  Starting GS1 Parser development environment..."

# Run in development mode using docker-compose
docker compose run --rm -it gs1parser sh -c "
  npm install &&
  echo 'Development environment ready!'
  echo 'Available commands:'
  echo '  npm run build    - Build the project'
  echo '  npm test         - Run tests'
  echo '  npm run test:watch - Run tests in watch mode'
  echo ''
  echo 'Press Ctrl+C to exit'
  sh
"
