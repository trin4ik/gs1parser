const { GS1Parser, parseGS1 } = require('../dist/index.js');

console.log('🚀 GS1 Parser Example\n');

// Example 1: Basic parsing
console.log('=== Example 1: Basic GS1 string parsing ===');
const parser = new GS1Parser();
const result1 = parser.parse('010123456789012817123456');

if (result1.success) {
  console.log('✅ Parsed successfully!');
  console.log('Tokens:', result1.tokens);
  console.log('Cleaned string:', result1.cleanedString);
} else {
  console.log('❌ Parse failed:', result1.error);
}

console.log('\n=== Example 2: Variable-length AIs ===');
const result2 = parser.parse('011234567890123210BATCH12321SERIAL456');

if (result2.success) {
  console.log('✅ Parsed successfully!');
  console.log('Tokens:', result2.tokens.map(t => `${t.ai}:${t.value}`));
  console.log('Cleaned string:', result2.cleanedString);
} else {
  console.log('❌ Parse failed:', result2.error);
}

console.log('\n=== Example 3: AI 91-99 with separators ===');
const result3 = parser.parse('011234567890123291INTERNAL92DATA');

if (result3.success) {
  console.log('✅ Parsed successfully!');
  console.log('Tokens:', result3.tokens.map(t => `${t.ai}:${t.value}`));
  console.log('Cleaned string:', result3.cleanedString);
} else {
  console.log('❌ Parse failed:', result3.error);
}

console.log('\n=== Example 4: Scanner artifacts ===');
const result4 = parser.parse(']C1 0101234567890128 029 91123456\r\n');

if (result4.success) {
  console.log('✅ Parsed successfully!');
  console.log('Tokens:', result4.tokens.map(t => `${t.ai}:${t.value}`));
  console.log('Cleaned string:', result4.cleanedString);
} else {
  console.log('❌ Parse failed:', result4.error);
}

console.log('\n=== Example 5: Custom configuration ===');
const customParser = new GS1Parser({
  separator: '|',
  scannerReplacements: {
    'XXX': ''
  }
});

const result5 = customParser.parse('0101234567890128XXX91123456');

if (result5.success) {
  console.log('✅ Parsed successfully!');
  console.log('Tokens:', result5.tokens.map(t => `${t.ai}:${t.value}`));
  console.log('Cleaned string:', result5.cleanedString);
} else {
  console.log('❌ Parse failed:', result5.error);
}

console.log('\n=== Example 6: Convenience function ===');
const result6 = parseGS1('010123456789012891123456', { separator: '|' });

if (result6.success) {
  console.log('✅ Parsed successfully!');
  console.log('Tokens:', result6.tokens.map(t => `${t.ai}:${t.value}`));
  console.log('Cleaned string:', result6.cleanedString);
} else {
  console.log('❌ Parse failed:', result6.error);
}

console.log('\n=== Example 7: Error handling ===');
const result7 = parser.parse('9901234567890128'); // Unknown AI

if (result7.success) {
  console.log('✅ Parsed successfully!');
} else {
  console.log('❌ Parse failed:', result7.error);
}

