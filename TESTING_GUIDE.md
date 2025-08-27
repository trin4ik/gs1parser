# 🧪 Руководство по тестированию GS1 Parser

## Способы тестирования вашего кода

> 📖 [English version](TESTING_GUIDE_EN.md)

### 1. Быстрое тестирование (рекомендуется)

```bash
# Создайте свой тестовый файл
cp examples/my-test-template.js my-test.js

# Отредактируйте my-test.js под свои нужды
# Затем запустите:
./scripts/test-my-code.sh my-test.js

# Или через npm:
npm run test-my-code my-test.js
```

### 2. Интерактивный режим разработки

```bash
# Запустите интерактивную оболочку
./scripts/docker-dev.sh

# Внутри контейнера вы можете:
# - Создавать файлы
# - Запускать node
# - Тестировать код в реальном времени
```

### 3. Прямое использование Docker

```bash
# Запуск одного файла
docker compose run --rm gs1parser node your-file.js

# Запуск с интерактивной оболочкой
docker compose run --rm -it gs1parser sh
```

## Примеры использования

### Базовый пример

```javascript
const { GS1Parser } = require('./dist/index.js');

const parser = new GS1Parser();
const result = parser.parse('010123456789012891INTERNAL92DATA');

console.log(result.tokens);        // Массив токенов
console.log(result.cleanedString); // Очищенная строка
```

### С кастомными настройками

```javascript
const parser = new GS1Parser({
  separator: '|',                    // Кастомный разделитель
  prioritize9199: false,             // Отключить приоритет 91-99
  scannerReplacements: {
    '029': '',                       // Удалить "029"
    ' ': '',                         // Удалить пробелы
    'MY_CUSTOM': '',                 // Ваши замены
  }
});
```

### Удобная функция

```javascript
const { parseGS1 } = require('./dist/index.js');

const result = parseGS1('010123456789012891123456', {
  separator: '|'
});
```

## Структура результата

```javascript
{
  success: boolean,        // Успешность парсинга
  tokens: [               // Массив токенов
    {
      ai: '01',           // Application Identifier
      value: '01234567890128', // Значение
      variable: false,    // Фиксированная/переменная длина
      startPos: 0,        // Начальная позиция
      endPos: 16          // Конечная позиция
    }
  ],
  cleanedString: '0101234567890128{GS}91123456', // Очищенная строка
  error?: string          // Ошибка (если есть)
}
```

## Поддерживаемые AI

### Фиксированные AI
- **00** (SSCC) - 18 цифр
- **01** (GTIN) - 14 цифр
- **11-17** (Даты) - 6 цифр (YYMMDD)
- **20** (Variant) - 2 цифры
- **410-417** (GLN) - 13 цифр
- И многие другие...

### Переменные AI
- **10** (Batch/Lot) - до 20 символов
- **21** (Serial) - до 20 символов
- **91-99** (Internal) - до 90 символов
- **400-403** (Order/Route) - до 30 символов
- И многие другие...

## Обработка ошибок

```javascript
const result = parser.parse('invalid-string');

if (!result.success) {
  console.log('Ошибка:', result.error);
  // Возможные ошибки:
  // - "Unknown AI at position X"
  // - "Truncated fixed AI XX at position X"
  // - "Invalid digits for fixed AI XX at position X"
}
```

## Советы по тестированию

1. **Начните с простых строк** - протестируйте базовую функциональность
2. **Добавьте артефакты сканера** - протестируйте очистку
3. **Проверьте AI 91-99** - убедитесь, что разделители вставляются
4. **Тестируйте ошибки** - проверьте обработку некорректных данных
5. **Используйте разные конфигурации** - протестируйте настройки

## Отладка

Если что-то не работает:

1. **Проверьте формат строки** - убедитесь, что AI корректные
2. **Посмотрите на ошибки** - они дают подсказки о проблеме
3. **Используйте простые примеры** - начните с известных рабочих строк
4. **Проверьте конфигурацию** - убедитесь, что настройки правильные
