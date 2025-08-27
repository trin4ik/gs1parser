const { GS1Parser } = require('../dist/index.js');

const parser = new GS1Parser();
const result = parser.parse('0104810065006079212pzvGp5V935Yvw');

console.log(result.tokens);        // Распарсенные токены
console.log(result.cleanedString); // Очищенная строка