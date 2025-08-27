# 🧪 Testing Guide for GS1 Parser

## Ways to Test Your Code

### 1. Quick Testing (Recommended)

```bash
# Create your test file
cp examples/my-test-template.js my-test.js

# Edit my-test.js for your needs
# Then run:
./scripts/test-my-code.sh my-test.js

# Or via npm:
npm run test-my-code my-test.js
```

### 2. Interactive Development Mode

```bash
# Start interactive shell
./scripts/docker-dev.sh

# Inside the container you can:
# - Create files
# - Run node
# - Test code in real time
```

### 3. Direct Docker Usage

```bash
# Run single file
docker compose run --rm gs1parser node your-file.js

# Run with interactive shell
docker compose run --rm -it gs1parser sh
```

## Usage Examples

### Basic Example

```javascript
const { GS1Parser } = require('./dist/index.js');

const parser = new GS1Parser();
const result = parser.parse('010123456789012891INTERNAL92DATA');

console.log(result.tokens);        // Token array
console.log(result.cleanedString); // Cleaned string
```

### With Custom Settings

```javascript
const parser = new GS1Parser({
  separator: '|',                    // Custom separator
  prioritize9199: false,             // Disable 91-99 priority
  scannerReplacements: {
    '029': '',                       // Remove "029"
    ' ': '',                         // Remove spaces
    'MY_CUSTOM': '',                 // Your replacements
  }
});
```

### Convenience Function

```javascript
const { parseGS1 } = require('./dist/index.js');

const result = parseGS1('010123456789012891123456', {
  separator: '|'
});
```

## Result Structure

```javascript
{
  success: boolean,        // Parsing success
  tokens: [               // Token array
    {
      ai: '01',           // Application Identifier
      value: '01234567890128', // Value
      variable: false,    // Fixed/variable length
      startPos: 0,        // Start position
      endPos: 16          // End position
    }
  ],
  cleanedString: '0101234567890128{GS}91123456', // Cleaned string
  error?: string          // Error (if any)
}
```

## Supported AIs

### Fixed AIs
- **00** (SSCC) - 18 digits
- **01** (GTIN) - 14 digits
- **11-17** (Dates) - 6 digits (YYMMDD)
- **20** (Variant) - 2 digits
- **410-417** (GLN) - 13 digits
- And many more...

### Variable AIs
- **10** (Batch/Lot) - up to 20 characters
- **21** (Serial) - up to 20 characters
- **91-99** (Internal) - up to 90 characters
- **400-403** (Order/Route) - up to 30 characters
- And many more...

## Error Handling

```javascript
const result = parser.parse('invalid-string');

if (!result.success) {
  console.log('Error:', result.error);
  // Possible errors:
  // - "Unknown AI at position X"
  // - "Truncated fixed AI XX at position X"
  // - "Invalid digits for fixed AI XX at position X"
}
```

## Testing Tips

1. **Start with simple strings** - test basic functionality
2. **Add scanner artifacts** - test cleaning
3. **Check AI 91-99** - ensure separators are inserted
4. **Test errors** - check incorrect data handling
5. **Use different configurations** - test settings

## Debugging

If something doesn't work:

1. **Check string format** - ensure AIs are correct
2. **Look at errors** - they give hints about the problem
3. **Use simple examples** - start with known working strings
4. **Check configuration** - ensure settings are correct

