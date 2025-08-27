# GS1 Parser

A TypeScript/JavaScript library for parsing GS1 strings from barcode scanners and restoring proper separators. Handles cases where scanners replace ASCII 29 (Group Separator) with other characters.

## Features

- ✅ Parse GS1 strings with fixed and variable-length Application Identifiers (AIs)
- ✅ Restore proper separators between AIs
- ✅ Handle common scanner artifacts (spaces, "029", etc.)
- ✅ Support for custom scanner replacement patterns
- ✅ Prioritize AI 91-99 for proper separator placement
- ✅ Comprehensive error handling
- ✅ TypeScript support with full type definitions
- ✅ Extensive test coverage

## Installation

```bash
npm install @trin4ik/gs1parser
```

## Quick Start

```typescript
import { GS1Parser, parseGS1 } from '@trin4ik/gs1parser';

// Using the class
const parser = new GS1Parser();
const result = parser.parse('010123456789012891INTERNAL92DATA');

// Or using the convenience function
const result = parseGS1('010123456789012891INTERNAL92DATA');

console.log(result);
// {
//   success: true,
//   tokens: [
//     { ai: '01', value: '01234567890128', variable: false, startPos: 0, endPos: 16 },
//     { ai: '91', value: 'INTERNAL', variable: true, startPos: 16, endPos: 24 },
//     { ai: '92', value: 'DATA', variable: true, startPos: 24, endPos: 28 }
//   ],
//   cleanedString: '0101234567890128{GS}91INTERNAL{GS}92DATA'
// }
```

## API Reference

### GS1Parser Class

#### Constructor

```typescript
new GS1Parser(config?: GS1ParserConfig)
```

**Configuration Options:**
- `separator?: string` - Custom separator to use instead of `{GS}` (default: `'{GS}'`)
- `prioritize9199?: boolean` - Whether to prioritize AI 91-99 when finding boundaries (default: `true`)
- `scannerReplacements?: Record<string, string>` - Custom scanner replacement patterns

#### Methods

##### `parse(input: string): GS1ParseResult`

Parses a GS1 string and returns the result.

**Parameters:**
- `input: string` - The GS1 string to parse

**Returns:**
```typescript
{
  success: boolean;
  tokens: GS1Token[];
  cleanedString: string;
  error?: string;
}
```

##### `addScannerReplacement(pattern: string, replacement: string): void`

Adds a custom scanner replacement pattern.

##### `removeScannerReplacement(pattern: string): boolean`

Removes a scanner replacement pattern.

##### `getScannerReplacements(): Map<string, string>`

Returns all current scanner replacement patterns.

### Convenience Function

#### `parseGS1(input: string, config?: GS1ParserConfig): GS1ParseResult`

Quick parsing function that creates a parser instance and parses the input.

## Types

### GS1Token

```typescript
{
  ai: string;           // Application Identifier (e.g., "01", "10", "91")
  value: string;        // Value of the AI
  variable: boolean;    // Whether this is a variable-length AI
  startPos: number;     // Start position in the original string
  endPos: number;       // End position in the original string
}
```

### GS1ParseResult

```typescript
{
  success: boolean;     // Whether parsing was successful
  tokens: GS1Token[];   // Array of parsed tokens
  cleanedString: string; // Cleaned string with proper separators
  error?: string;       // Error message if parsing failed
}
```

### GS1ParserConfig

```typescript
{
  separator?: string;   // Custom separator to use instead of {GS}
  prioritize9199?: boolean; // Whether to prioritize AI 91-99
  scannerReplacements?: Record<string, string>; // Custom scanner replacements
}
```

## Examples

### Basic Usage

```typescript
import { GS1Parser } from '@trin4ik/gs1parser';

const parser = new GS1Parser();
const result = parser.parse('010123456789012817123456');

if (result.success) {
  console.log('Tokens:', result.tokens);
  console.log('Cleaned string:', result.cleanedString);
} else {
  console.error('Parse error:', result.error);
}
```

### Custom Configuration

```typescript
import { GS1Parser } from '@trin4ik/gs1parser';

const parser = new GS1Parser({
  separator: '|',
  prioritize9199: false,
  scannerReplacements: {
    'XXX': '',
    'YYY': ''
  }
});

const result = parser.parse('0101234567890128XXX91123456');
// Result: '0101234567890128|91123456'
```

### Handling Scanner Artifacts

```typescript
import { GS1Parser } from '@trin4ik/gs1parser';

const parser = new GS1Parser();

// Handle common scanner replacements
parser.addScannerReplacement('029', '');  // Some scanners send "029"
parser.addScannerReplacement(' ', '');    // Some scanners send spaces

const result = parser.parse('0101234567890128 029 91123456');
// Result: '0101234567890128{GS}91123456'
```

### Working with Variable-Length AIs

```typescript
import { GS1Parser } from '@trin4ik/gs1parser';

const parser = new GS1Parser();
const result = parser.parse('011234567890123210BATCH12321SERIAL456');

console.log(result.tokens);
// [
//   { ai: '01', value: '12345678901232', variable: false },
//   { ai: '10', value: 'BATCH123', variable: true },
//   { ai: '21', value: 'SERIAL456', variable: true }
// ]
```

## Supported Application Identifiers

The library supports a comprehensive set of GS1 Application Identifiers including:

### Fixed-Length AIs
- **00** (SSCC) - 18 digits
- **01** (GTIN) - 14 digits
- **02** (CONTENT) - 14 digits
- **11-17** (Dates) - 6 digits (YYMMDD)
- **20** (VARIANT) - 2 digits
- **310n-369n** (Measures) - 6 digits
- **410-417** (GLN) - 13 digits
- And many more... ([full list](https://ref.gs1.org/standards/genspecs/))

### Variable-Length AIs
- **10** (BATCH/LOT) - up to 20 characters
- **21** (SERIAL) - up to 20 characters
- **91-99** (INTERNAL) - up to 90 characters
- **400-403** (Order/Route) - up to 30 characters
- And many more... ([full list](https://ref.gs1.org/standards/genspecs/))

## Error Handling

The parser provides detailed error messages for common issues:

- Invalid input type
- Unknown Application Identifiers
- Truncated fixed-length AIs
- Invalid digit sequences
- Malformed strings

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Type Checking

```bash
npx tsc --noEmit
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

