#!/bin/bash

echo "🧪 Testing your GS1 Parser code..."

# Check if a file was provided
if [ -z "$1" ]; then
    echo "❌ Usage: $0 <your-test-file.js>"
    echo ""
    echo "Examples:"
    echo "  $0 my-test.js"
    echo "  $0 examples/my-custom-test.js"
    echo ""
    echo "Or create a test file and run:"
    echo "  echo 'const { GS1Parser } = require(\"./dist/index.js\");' > my-test.js"
    echo "  echo 'console.log(parser.parse(\"0101234567890128\"));' >> my-test.js"
    echo "  $0 my-test.js"
    exit 1
fi

TEST_FILE="$1"

# Check if file exists
if [ ! -f "$TEST_FILE" ]; then
    echo "❌ File '$TEST_FILE' not found!"
    exit 1
fi

echo "📁 Testing file: $TEST_FILE"
echo ""

# Run the test file
docker compose run --rm gs1parser sh -c "
  npm install &&
  npm run build &&
  node $TEST_FILE
"

echo ""
echo "✅ Test completed!"

