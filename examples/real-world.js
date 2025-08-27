const { GS1Parser, parseGS1 } = require('../dist/index.js');

console.log('🌍 Real-World GS1 Parser Examples\n');

// Создаем парсер с кастомными настройками для разных сканеров
const parser = new GS1Parser({
  separator: '|',
  scannerReplacements: {
    '029': '',    // Некоторые сканеры отправляют "029"
    ' ': '',      // Некоторые сканеры отправляют пробелы
    '\\r': '',    // Возврат каретки
    '\\n': '',    // Перевод строки
  }
});

// Пример 1: Штрих-код товара с датой производства и сроком годности
console.log('=== Example 1: Product barcode with dates ===');
const productBarcode = ']d201012345678901281712345615123456';
const result1 = parser.parse(productBarcode);

if (result1.success) {
  console.log('✅ Product barcode parsed:');
  result1.tokens.forEach(token => {
    switch(token.ai) {
      case '01':
        console.log(`  📦 GTIN: ${token.value}`);
        break;
      case '17':
        console.log(`  📅 Expiry date: ${token.value} (YYMMDD)`);
        break;
      case '15':
        console.log(`  📅 Best before: ${token.value} (YYMMDD)`);
        break;
    }
  });
  console.log(`  🔧 Cleaned: ${result1.cleanedString}`);
} else {
  console.log('❌ Parse failed:', result1.error);
}

// Пример 2: Логистическая единица с партией и серийным номером
console.log('\n=== Example 2: Logistic unit with batch and serial ===');
const logisticUnit = '000123456789012345610BATCH12321SERIAL456';
const result2 = parser.parse(logisticUnit);

if (result2.success) {
  console.log('✅ Logistic unit parsed:');
  result2.tokens.forEach(token => {
    switch(token.ai) {
      case '00':
        console.log(`  📦 SSCC: ${token.value}`);
        break;
      case '10':
        console.log(`  🏷️  Batch/Lot: ${token.value}`);
        break;
      case '21':
        console.log(`  🔢 Serial: ${token.value}`);
        break;
    }
  });
  console.log(`  🔧 Cleaned: ${result2.cleanedString}`);
} else {
  console.log('❌ Parse failed:', result2.error);
  console.log('  💡 This is expected - the string contains invalid AI combinations');
}

// Пример 3: Сканер с артефактами
console.log('\n=== Example 3: Scanner with artifacts ===');
const scannerOutput = ']C1 0101234567890128 029 91123456 029 92234567\\r\\n';
const result3 = parser.parse(scannerOutput);

if (result3.success) {
  console.log('✅ Scanner output cleaned:');
  result3.tokens.forEach(token => {
    switch(token.ai) {
      case '01':
        console.log(`  📦 GTIN: ${token.value}`);
        break;
      case '91':
        console.log(`  🏢 Internal 91: ${token.value}`);
        break;
      case '92':
        console.log(`  🏢 Internal 92: ${token.value}`);
        break;
    }
  });
  console.log(`  🔧 Cleaned: ${result3.cleanedString}`);
} else {
  console.log('❌ Parse failed:', result3.error);
}

// Пример 4: Сложная строка с множественными AI
console.log('\n=== Example 4: Complex string with multiple AIs ===');
const complexString = '01012345678901281712345610BATCH12321SERIAL45691INTERNAL92DATA';
const result4 = parser.parse(complexString);

if (result4.success) {
  console.log('✅ Complex string parsed:');
  console.log(`  📊 Total tokens: ${result4.tokens.length}`);
  result4.tokens.forEach((token, index) => {
    console.log(`  ${index + 1}. AI ${token.ai}: ${token.value} ${token.variable ? '(variable)' : '(fixed)'}`);
  });
  console.log(`  🔧 Cleaned: ${result4.cleanedString}`);
} else {
  console.log('❌ Parse failed:', result4.error);
}

// Пример 5: Обработка ошибок
console.log('\n=== Example 5: Error handling ===');
const invalidStrings = [
  '9901234567890128',           // Неизвестный AI
  '010123456789012',            // Неполный GTIN
  '01ABCDEFGHIJKLM17',          // Неверные символы в GTIN
  '01012345678901281712345699', // Неизвестный AI в конце
];

invalidStrings.forEach((str, index) => {
  const result = parser.parse(str);
  console.log(`  ${index + 1}. "${str}": ${result.success ? '✅' : '❌'} ${result.error || 'OK'}`);
});

// Пример 6: Кастомные замены для специфичного сканера
console.log('\n=== Example 6: Custom scanner replacements ===');
const customParser = new GS1Parser({
  separator: '|',
  scannerReplacements: {
    'GS': '',      // Некоторые сканеры отправляют "GS"
    'RS': '',      // Некоторые сканеры отправляют "RS"
    'XXX': '',     // Кастомный артефакт
  }
});

const customScannerOutput = '0101234567890128GS91INTERNALRS92DATAXXX93MORE';
const result6 = customParser.parse(customScannerOutput);

if (result6.success) {
  console.log('✅ Custom scanner output parsed:');
  result6.tokens.forEach(token => {
    console.log(`  AI ${token.ai}: ${token.value}`);
  });
  console.log(`  🔧 Cleaned: ${result6.cleanedString}`);
} else {
  console.log('❌ Parse failed:', result6.error);
}

console.log('\n🎉 All examples completed!');
