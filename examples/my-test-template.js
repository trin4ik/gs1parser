const { GS1Parser, parseGS1 } = require('../dist/index.js');

console.log('🧪 My GS1 Parser Test\n');

// Создаем парсер с нужными настройками
const parser = new GS1Parser({
  separator: '{GS}',  // Можно изменить на любой разделитель
  prioritize9199: true,
  scannerReplacements: {
    '029': '',    // Замены для вашего сканера
    ' ': '',      // Удаление пробелов
    // Добавьте свои замены здесь
  }
});

// === ВАШ КОД ДЛЯ ТЕСТИРОВАНИЯ ===

// Пример 1: Простая строка
console.log('=== Test 1: Simple string ===');
const result1 = parser.parse('0101234567890128');
console.log('Result:', result1);

// Пример 2: Строка с артефактами сканера
console.log('\n=== Test 2: Scanner artifacts ===');
const result2 = parser.parse('0101234567890128 029 91123456');
console.log('Result:', result2);

// Пример 3: Ваша строка (замените на свою)
console.log('\n=== Test 3: Your string ===');
const myString = '010123456789012891INTERNAL92DATA'; // ЗАМЕНИТЕ НА СВОЮ СТРОКУ
const result3 = parser.parse(myString);
console.log('Result:', result3);

// === ДОПОЛНИТЕЛЬНЫЕ ТЕСТЫ ===

// Тест с удобной функцией
console.log('\n=== Test 4: Convenience function ===');
const result4 = parseGS1('010123456789012891123456', { separator: '|' });
console.log('Result:', result4);

// Тест обработки ошибок
console.log('\n=== Test 5: Error handling ===');
const result5 = parser.parse('9901234567890128'); // Неизвестный AI
console.log('Result:', result5);

// === ВАШИ ДОПОЛНИТЕЛЬНЫЕ ТЕСТЫ ===
// Добавьте здесь свои тесты

console.log('\n🎉 Testing completed!');

