import { GS1Parser, parseGS1 } from './index';

describe('GS1Parser', () => {
  let parser: GS1Parser;

  beforeEach(() => {
    parser = new GS1Parser();
  });

  describe('Basic parsing', () => {
    it('should parse a simple GS1 string with fixed AIs', () => {
      const result = parser.parse('010123456789012817123456');
      
      expect(result.success).toBe(true);
      expect(result.tokens).toHaveLength(2);
      expect(result.tokens[0]).toEqual({
        ai: '01',
        value: '01234567890128',
        variable: false,
        startPos: 0,
        endPos: 16
      });
      expect(result.tokens[1]).toEqual({
        ai: '17',
        value: '123456',
        variable: false,
        startPos: 16,
        endPos: 24
      });
      expect(result.cleanedString).toBe('010123456789012817123456');
    });

    it('should parse a string with variable AIs', () => {
      const result = parser.parse('011234567890123210BATCH123');
      
      expect(result.success).toBe(true);
      expect(result.tokens).toHaveLength(2);
      expect(result.tokens[0].ai).toBe('01');
      expect(result.tokens[0].value).toBe('12345678901232');
      expect(result.tokens[1].ai).toBe('10');
      expect(result.tokens[1].value).toBe('BATCH123');
      expect(result.tokens[1].variable).toBe(true);
    });

    it('should handle AI 91-99 with separators', () => {
      const result = parser.parse('011234567890123291INTERNAL92DATA');
      
      expect(result.success).toBe(true);
      expect(result.tokens).toHaveLength(3);
      expect(result.tokens[0].ai).toBe('01');
      expect(result.tokens[1].ai).toBe('91');
      expect(result.tokens[1].value).toBe('INTERNAL');
      expect(result.tokens[2].ai).toBe('92');
      expect(result.tokens[2].value).toBe('DATA');
      expect(result.cleanedString).toBe('0112345678901232{GS}91INTERNAL{GS}92DATA');
    });
  });

  describe('Scanner replacements', () => {
    it('should handle "029" replacement', () => {
      const result = parser.parse('010123456789012802991123456');
      
      expect(result.success).toBe(true);
      expect(result.tokens).toHaveLength(2);
      expect(result.cleanedString).toBe('0101234567890128{GS}91123456');
    });

    it('should handle space replacement', () => {
      const result = parser.parse('0101234567890128 91123456');
      
      expect(result.success).toBe(true);
      expect(result.tokens).toHaveLength(2);
      expect(result.cleanedString).toBe('0101234567890128{GS}91123456');
    });

    it('should handle custom scanner replacements', () => {
      const customParser = new GS1Parser({
        scannerReplacements: {
          'XXX': ''
        }
      });
      
      const result = customParser.parse('0101234567890128XXX91123456');
      
      expect(result.success).toBe(true);
      expect(result.tokens).toHaveLength(2);
      expect(result.cleanedString).toBe('0101234567890128{GS}91123456');
    });
  });

  describe('Input cleaning', () => {
    it('should remove trailing line breaks', () => {
      const result = parser.parse('0101234567890128\r\n');
      
      expect(result.success).toBe(true);
      expect(result.tokens).toHaveLength(1);
      expect(result.tokens[0].ai).toBe('01');
    });

    it('should remove AIM ID prefix', () => {
      const result = parser.parse(']d20101234567890128');
      
      expect(result.success).toBe(true);
      expect(result.tokens).toHaveLength(1);
      expect(result.tokens[0].ai).toBe('01');
    });

    it('should handle mixed cleaning scenarios', () => {
      const result = parser.parse(']C1 0101234567890128 029 91123456\r\n');
      
      expect(result.success).toBe(true);
      expect(result.tokens).toHaveLength(2);
      expect(result.cleanedString).toBe('0101234567890128{GS}91123456');
    });
  });

  describe('Error handling', () => {
    it('should handle invalid input type', () => {
      const result = parser.parse(null as any);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Input must be a string');
    });

    it('should handle unknown AI', () => {
      const result = parser.parse('9901234567890128');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown AI at position');
    });

    it('should handle truncated fixed AI', () => {
      const result = parser.parse('010123456789012'); // Incomplete GTIN
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Truncated fixed AI 01');
    });

    it('should handle invalid digits in fixed AI', () => {
      const result = parser.parse('01ABCDEFGHIJKLM17'); // Non-numeric GTIN
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid digits for fixed AI 01');
    });
  });

  describe('Configuration', () => {
    it('should use custom separator', () => {
      const customParser = new GS1Parser({ separator: '|' });
      const result = customParser.parse('010123456789012891123456');
      
      expect(result.success).toBe(true);
      expect(result.cleanedString).toBe('0101234567890128|91123456');
    });

    it('should disable 91-99 prioritization', () => {
      const customParser = new GS1Parser({ prioritize9199: false });
      const result = customParser.parse('010123456789012810BATCH9123456');
      
      expect(result.success).toBe(true);
      // Should find AI 10 first, then 91
      expect(result.tokens[1].ai).toBe('10');
      expect(result.tokens[1].value).toBe('BATCH');
      expect(result.tokens[2].ai).toBe('91');
      expect(result.tokens[2].value).toBe('23456');
    });
  });

  describe('Convenience function', () => {
    it('should work with parseGS1 function', () => {
      const result = parseGS1('010123456789012891123456');
      
      expect(result.success).toBe(true);
      expect(result.tokens).toHaveLength(2);
      expect(result.cleanedString).toBe('0101234567890128{GS}91123456');
    });

    it('should work with custom config', () => {
      const result = parseGS1('010123456789012891123456', { separator: '|' });
      
      expect(result.success).toBe(true);
      expect(result.cleanedString).toBe('0101234567890128|91123456');
    });
  });

  describe('Scanner replacement management', () => {
    it('should allow adding custom replacements', () => {
      parser.addScannerReplacement('ZZZ', '');
      const result = parser.parse('0101234567890128ZZZ91123456');
      
      expect(result.success).toBe(true);
      expect(result.cleanedString).toBe('0101234567890128{GS}91123456');
    });

    it('should allow removing replacements', () => {
      parser.removeScannerReplacement('029');
      const result = parser.parse('010123456789012802991123456');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Truncated fixed AI 02');
    });

    it('should return scanner replacements', () => {
      const replacements = parser.getScannerReplacements();
      
      expect(replacements.has('029')).toBe(true);
      expect(replacements.has(' ')).toBe(true);
      expect(replacements.get('029')).toBe('');
    });
  });
});
