/**
 * GS1 Application Identifier (AI) token
 */
export interface GS1Token {
  /** Application Identifier (e.g., "01", "10", "91") */
  ai: string;
  /** Value of the AI */
  value: string;
  /** Whether this is a variable-length AI */
  variable: boolean;
  /** Start position in the original string */
  startPos: number;
  /** End position in the original string */
  endPos: number;
}

/**
 * Result of GS1 string parsing
 */
export interface GS1ParseResult {
  /** Whether parsing was successful */
  success: boolean;
  /** Array of parsed tokens */
  tokens: GS1Token[];
  /** Cleaned string with proper separators */
  cleanedString: string;
  /** Error message if parsing failed */
  error?: string;
}

/**
 * Configuration for GS1 parser
 */
export interface GS1ParserConfig {
  /** Custom separator to use instead of {GS} */
  separator?: string;
  /** Whether to prioritize AI 91-99 when finding boundaries */
  prioritize9199?: boolean;
  /** Custom scanner replacements to clean */
  scannerReplacements?: Record<string, string>;
}

/**
 * Fixed-length AI definition
 */
export interface FixedAI {
  [ai: string]: number;
}

/**
 * Variable-length AI definition
 */
export interface VariableAI {
  [ai: string]: number;
}

