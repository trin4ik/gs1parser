# GS1 Parser

Библиотека TypeScript/JavaScript для парсинга GS1 строк от сканеров штрих-кодов и восстановления правильных разделителей. Обрабатывает случаи, когда сканеры заменяют ASCII 29 (Group Separator) на другие символы.

> 📖 [English version](README_EN.md)

## Возможности

- ✅ Парсинг GS1 строк с фиксированными и переменными Application Identifiers (AI)
- ✅ Восстановление правильных разделителей между AI
- ✅ Обработка артефактов сканера (пробелы, "029", и т.д.)
- ✅ Поддержка кастомных паттернов замены сканера
- ✅ Приоритизация AI 91-99 для правильного размещения разделителей (привет, Честный Знак)
- ✅ Комплексная обработка ошибок
- ✅ Поддержка TypeScript с полными определениями типов
- ✅ Обширное покрытие тестами

## Установка

```bash
npm install @trin4ik/gs1parser
```

## Быстрый старт

```typescript
import { GS1Parser, parseGS1 } from '@trin4ik/gs1parser';

// Использование класса
const parser = new GS1Parser();
const result = parser.parse('010123456789012891INTERNAL92DATA');

// Или использование удобной функции
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

## Справочник API

### Класс GS1Parser

#### Конструктор

```typescript
new GS1Parser(config?: GS1ParserConfig)
```

**Параметры конфигурации:**
- `separator?: string` - Кастомный разделитель вместо `{GS}` (по умолчанию: `'{GS}'`)
- `prioritize9199?: boolean` - Приоритизировать ли AI 91-99 при поиске границ (по умолчанию: `true`)
- `scannerReplacements?: Record<string, string>` - Кастомные паттерны замены сканера

#### Методы

##### `parse(input: string): GS1ParseResult`

Парсит GS1 строку и возвращает результат.

**Параметры:**
- `input: string` - GS1 строка для парсинга

**Возвращает:**
```typescript
{
  success: boolean;
  tokens: GS1Token[];
  cleanedString: string;
  error?: string;
}
```

##### `addScannerReplacement(pattern: string, replacement: string): void`

Добавляет кастомный паттерн замены сканера.

##### `removeScannerReplacement(pattern: string): boolean`

Удаляет паттерн замены сканера.

##### `getScannerReplacements(): Map<string, string>`

Возвращает все текущие паттерны замены сканера.

### Удобная функция

#### `parseGS1(input: string, config?: GS1ParserConfig): GS1ParseResult`

Быстрая функция парсинга, которая создает экземпляр парсера и парсит входную строку.

## Типы

### GS1Token

```typescript
{
  ai: string;           // Application Identifier (например, "01", "10", "91")
  value: string;        // Значение AI
  variable: boolean;    // Является ли это AI с переменной длиной
  startPos: number;     // Начальная позиция в исходной строке
  endPos: number;       // Конечная позиция в исходной строке
}
```

### GS1ParseResult

```typescript
{
  success: boolean;     // Успешен ли парсинг
  tokens: GS1Token[];   // Массив распарсенных токенов
  cleanedString: string; // Очищенная строка с правильными разделителями
  error?: string;       // Сообщение об ошибке, если парсинг не удался
}
```

### GS1ParserConfig

```typescript
{
  separator?: string;   // Кастомный разделитель вместо {GS}
  prioritize9199?: boolean; // Приоритизировать ли AI 91-99
  scannerReplacements?: Record<string, string>; // Кастомные замены сканера
}
```

## Примеры

### Базовое использование

```typescript
import { GS1Parser } from '@trin4ik/gs1parser';

const parser = new GS1Parser();
const result = parser.parse('010123456789012817123456');

if (result.success) {
  console.log('Токены:', result.tokens);
  console.log('Очищенная строка:', result.cleanedString);
} else {
  console.error('Ошибка парсинга:', result.error);
}
```

### Кастомная конфигурация

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
// Результат: '0101234567890128|91123456'
```

### Обработка артефактов сканера

```typescript
import { GS1Parser } from '@trin4ik/gs1parser';

const parser = new GS1Parser();

// Обработка общих замен сканера
parser.addScannerReplacement('029', '');  // Некоторые сканеры отправляют "029"
parser.addScannerReplacement(' ', '');    // Некоторые сканеры отправляют пробелы

const result = parser.parse('0101234567890128 029 91123456');
// Результат: '0101234567890128{GS}91123456'
```

### Работа с AI переменной длины

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

## Поддерживаемые Application Identifiers

Библиотека поддерживает комплексный набор GS1 Application Identifiers, включая:

### AI с фиксированной длиной
- **00** (SSCC) - 18 цифр
- **01** (GTIN) - 14 цифр
- **02** (CONTENT) - 14 цифр
- **11-17** (Даты) - 6 цифр (YYMMDD)
- **20** (VARIANT) - 2 цифры
- **310n-369n** (Меры) - 6 цифр
- **410-417** (GLN) - 13 цифр
- И многие другие... ([полный список](https://ref.gs1.org/standards/genspecs/))

### AI с переменной длиной
- **10** (BATCH/LOT) - до 20 символов
- **21** (SERIAL) - до 20 символов
- **91-99** (INTERNAL) - до 90 символов
- **400-403** (Order/Route) - до 30 символов
- И многие другие... ([полный список](https://ref.gs1.org/standards/genspecs/))

## Обработка ошибок

Парсер предоставляет подробные сообщения об ошибках для распространенных проблем:

- Неверный тип входных данных
- Неизвестные Application Identifiers
- Обрезанные AI с фиксированной длиной
- Неверные последовательности цифр
- Некорректно сформированные строки

## Разработка

### Сборка

```bash
npm run build
```

### Тестирование

```bash
npm test
```

### Проверка типов

```bash
npx tsc --noEmit
```

## Лицензия

MIT

## Вклад в проект

Вклады приветствуются! Не стесняйтесь отправлять Pull Request.
