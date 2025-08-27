export { GS1Parser } from './parser';
export type { 
  GS1Token, 
  GS1ParseResult, 
  GS1ParserConfig,
  FixedAI,
  VariableAI 
} from './types';
export { FIXED_AI, VARIABLE_AI } from './ai-definitions';

// Convenience function for quick parsing
import type { GS1ParserConfig, GS1ParseResult } from './types';
import { GS1Parser } from './parser';

export function parseGS1(input: string, config?: GS1ParserConfig): GS1ParseResult {
  const parser = new GS1Parser(config);
  return parser.parse(input);
}

// Default export
export default GS1Parser;
