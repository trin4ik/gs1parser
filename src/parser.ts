import { GS1Token, GS1ParseResult, GS1ParserConfig } from './types';
import { FIXED_AI, VARIABLE_AI } from './ai-definitions';

/**
 * GS1 String Parser
 * 
 * Parses GS1 strings from barcode scanners and restores proper separators.
 * Handles cases where scanners replace ASCII 29 (Group Separator) with other characters.
 */
export class GS1Parser {
  private config: Required<GS1ParserConfig>;
  private scannerReplacements: Map<string, string>;

  constructor(config: GS1ParserConfig = {}) {
    this.config = {
      separator: config.separator || '{GS}',
      prioritize9199: config.prioritize9199 ?? true,
      scannerReplacements: config.scannerReplacements || {},
    };

    // Initialize scanner replacements map
    this.scannerReplacements = new Map();
    
    // Add common scanner replacements
    this.scannerReplacements.set('029', ''); // Some scanners send "029" instead of GS
    this.scannerReplacements.set(' ', '');   // Some scanners send space instead of GS
    
    // Add custom replacements
    Object.entries(this.config.scannerReplacements).forEach(([key, value]) => {
      this.scannerReplacements.set(key, value);
    });
  }

  /**
   * Parse a GS1 string and return tokens with cleaned string
   */
  public parse(input: string): GS1ParseResult {
    if (typeof input !== 'string') {
      return {
        success: false,
        tokens: [],
        cleanedString: '',
        error: 'Input must be a string'
      };
    }

    try {
      // Clean the input string
      const cleanedInput = this.cleanInput(input);
      
      // Parse the cleaned string
      const tokens = this.parseTokens(cleanedInput);
      
      // Build the final cleaned string with proper separators
      const cleanedString = this.buildCleanedString(tokens);

      return {
        success: true,
        tokens,
        cleanedString
      };
    } catch (error) {
      return {
        success: false,
        tokens: [],
        cleanedString: '',
        error: error instanceof Error ? error.message : 'Unknown parsing error'
      };
    }
  }

  /**
   * Clean input string by removing scanner artifacts and AIM identifiers
   */
  private cleanInput(input: string): string {
    let cleaned = input
      .replace(/[\r\n]+$/, '') // Remove trailing line breaks
      .trim()
      .replace(/^\](d2|C1)/i, ''); // Remove AIM ID prefix if present

    // Replace known scanner artifacts
    this.scannerReplacements.forEach((replacement, pattern) => {
      cleaned = cleaned.replace(new RegExp(pattern, 'g'), replacement);
    });

    return cleaned;
  }

  /**
   * Parse the cleaned string into tokens
   */
  private parseTokens(input: string): GS1Token[] {
    const tokens: GS1Token[] = [];
    let position = 0;

    while (position < input.length) {
      const aiResult = this.tryParseAI(input, position);
      if (!aiResult) {
        throw new Error(`Unknown AI at position ${position}`);
      }

      const { ai, aiLength } = aiResult;
      const aiStartPos = position;
      position += aiLength;

      let value: string;
      let valueEndPos: number;

      if (FIXED_AI[ai] !== undefined) {
        // Fixed-length AI
        const valueLength = FIXED_AI[ai];
        if (position + valueLength > input.length) {
          throw new Error(`Truncated fixed AI ${ai} at position ${position}`);
        }

        value = input.slice(position, position + valueLength);
        
        // Validate fixed AI value (should be numeric)
        if (!/^\d+$/.test(value)) {
          throw new Error(`Invalid digits for fixed AI ${ai} at position ${position}`);
        }

        valueEndPos = position + valueLength;
        position = valueEndPos;
      } else {
        // Variable-length AI
        const maxLength = this.getVariableAIMaxLength(ai);
        const valueStart = position;
        
        // Find the end of the variable value
        if (maxLength === undefined) {
          throw new Error(`Unknown variable AI ${ai} at position ${position}`);
        }
        const valueEnd = this.findVariableValueEnd(input, position, maxLength, ai);
        value = input.slice(valueStart, valueEnd);
        valueEndPos = valueEnd;
        position = valueEnd;
      }

      tokens.push({
        ai,
        value,
        variable: FIXED_AI[ai] === undefined,
        startPos: aiStartPos,
        endPos: valueEndPos
      });
    }

    return tokens;
  }

  /**
   * Try to parse an AI at the given position
   */
  private tryParseAI(input: string, position: number): { ai: string; aiLength: number } | null {
    // Try 4, 3, then 2 digits
    for (const length of [4, 3, 2]) {
      if (position + length <= input.length) {
        const candidate = input.slice(position, position + length);
        if (/^\d+$/.test(candidate) && this.isKnownAI(candidate)) {
          return { ai: candidate, aiLength: length };
        }
      }
    }
    return null;
  }

  /**
   * Check if an AI is known (either fixed or variable)
   */
  private isKnownAI(ai: string): boolean {
    // Check fixed AIs first
    if (FIXED_AI[ai] !== undefined) {
      return true;
    }
    
    // Check variable AIs
    const maxLength = this.getVariableAIMaxLength(ai);
    return maxLength !== undefined;
  }

  /**
   * Get maximum length for a variable AI
   */
  private getVariableAIMaxLength(ai: string): number | undefined {
    // Handle special case for 91-99 (but not 99 alone and not 4-digit numbers starting with 91)
    if (ai >= '91' && ai <= '99' && ai !== '99' && ai.length <= 2) {
      return VARIABLE_AI['91-99'];
    }
    
    // Handle special cases for AI with 'n' suffix (like 310n, 311n, etc.)
    if (ai.endsWith('n')) {
      const baseAI = ai.slice(0, -1);
      return VARIABLE_AI[baseAI + 'n'];
    }
    
    return VARIABLE_AI[ai];
  }

  /**
   * Find the end position of a variable-length AI value
   */
  private findVariableValueEnd(input: string, startPos: number, maxLength: number, _currentAI: string): number {
    const searchEnd = Math.min(input.length, startPos + maxLength);
    let earliestValidAI: { pos: number; ai: string; len: number } | null = null;
    let earliestPreferredAI: { pos: number; ai: string; len: number } | null = null;

    // Search for the next AI in the window
    for (let pos = startPos; pos < searchEnd; pos++) {
      const aiResult = this.tryParseAI(input, pos);
      if (!aiResult) continue;

      const { ai, aiLength } = aiResult;
      
      // Validate that this AI candidate is legitimate
      if (this.isValidNextAI(ai, pos + aiLength, input)) {
        if (!earliestValidAI) {
          earliestValidAI = { pos, ai, len: aiLength };
        }

        // Check if this is a preferred AI (91-99)
        if (this.config.prioritize9199 && ai >= '91' && ai <= '99') {
          earliestPreferredAI = { pos, ai, len: aiLength };
          break; // Found preferred AI, stop searching
        }
      }
    }

    // Return the appropriate end position
    if (earliestPreferredAI) {
      return earliestPreferredAI.pos;
    } else if (earliestValidAI) {
      return earliestValidAI.pos;
    } else {
      // No next AI found, use max length or end of string
      return Math.min(input.length, startPos + maxLength);
    }
  }

  /**
   * Validate that a candidate AI is a legitimate next AI
   */
  private isValidNextAI(ai: string, valueStartPos: number, input: string): boolean {
    if (FIXED_AI[ai] !== undefined) {
      // For fixed AIs, validate that the value looks correct
      return this.validateFixedAIValue(ai, valueStartPos, input);
    } else {
      // For variable AIs, just check if we have enough space
      const maxLength = this.getVariableAIMaxLength(ai);
      return maxLength !== undefined && valueStartPos < input.length;
    }
  }

  /**
   * Validate that a fixed AI has a proper value
   */
  private validateFixedAIValue(ai: string, valueStartPos: number, input: string): boolean {
    const requiredLength = FIXED_AI[ai];
    if (valueStartPos + requiredLength > input.length) {
      return false;
    }

    const value = input.slice(valueStartPos, valueStartPos + requiredLength);
    return /^\d+$/.test(value); // Most fixed AIs expect numeric values
  }

  /**
   * Build the final cleaned string with proper separators
   */
  private buildCleanedString(tokens: GS1Token[]): string {
    let result = '';
    
    tokens.forEach((token, index) => {
      // Add separator before AI 91-99 (except for the first token)
      if (index > 0 && token.ai >= '91' && token.ai <= '99') {
        result += this.config.separator;
      }
      
      result += token.ai + token.value;
    });

    return result;
  }

  /**
   * Add custom scanner replacement pattern
   */
  public addScannerReplacement(pattern: string, replacement: string): void {
    this.scannerReplacements.set(pattern, replacement);
  }

  /**
   * Remove scanner replacement pattern
   */
  public removeScannerReplacement(pattern: string): boolean {
    return this.scannerReplacements.delete(pattern);
  }

  /**
   * Get all scanner replacements
   */
  public getScannerReplacements(): Map<string, string> {
    return new Map(this.scannerReplacements);
  }
}
