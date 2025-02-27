export type JSONPointer = string;
export type URIFragmentJSONPointer = string;
export type StringifiedJSONPointer = string;
export type ReferenceToken = string;
export type EscapedReferenceToken = string;
export type UnescapedReferenceToken = string;

type Digit1To9 = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Digit0To9 = "0" | Digit1To9;
type NumberString<T extends string = ""> = `${Digit0To9}${T}` | T;
type NonZeroNumber = `${Digit1To9}${NumberString}`;
export type ArrayIndex = "0" | NonZeroNumber;
export type ArrayDash = '-';
export type ArrayLocation = ArrayIndex | ArrayDash;

/**
 * Parsing
 */
export function parse(jsonPointer: JSONPointer): ParseResult;

interface ParseResult {
  readonly result: {
    readonly success: boolean;
  };
  readonly ast: {
    readonly translate: (parts: any[]) => Array<[string, string]>;
    readonly toXml: () => string;
  };
  computed: null | UnescapedReferenceToken[]
}

/**
 * Testing
 */
export function testJSONPointer(jsonPointer: string): jsonPointer is JSONPointer;
export function testReferenceToken(referenceToken: string): referenceToken is ReferenceToken;
export function testArrayLocation(referenceToken: string): referenceToken is ArrayLocation;
export function testArrayIndex(referenceToken: string): referenceToken is ArrayIndex;
export function testArrayDash(referenceToken: string): referenceToken is ArrayDash;

/**
 * Escaping
 */
export function escape(referenceToken: UnescapedReferenceToken): EscapedReferenceToken;
export function unescape(referenceToken: EscapedReferenceToken): UnescapedReferenceToken;

/**
 * Compiling
 */
export function compile(referenceTokens: UnescapedReferenceToken[]): JSONPointer;

/**
 * Evaluating
 */
export interface EvaluationOptions {
  strictArrays?: boolean;
  strictObjects?: boolean;
}

export type JSONArray = any[];
export type JSONObject = Record<string, any>;

export function evaluate(value: JSONArray | JSONObject, jsonPointer: JSONPointer, options?: EvaluationOptions): unknown;

/**
 * Representing
 */
export interface JSONString {
  to(jsonPointer: JSONPointer): StringifiedJSONPointer;
  from(jsonPointer: StringifiedJSONPointer): JSONPointer
}

export interface URIFragmentIdentifier {
  to(jsonPointer: JSONPointer): URIFragmentJSONPointer;
  from(jsonPointer: URIFragmentJSONPointer): JSONPointer
}

/**
 * Grammar
 */
export function Grammar(): Grammar;

export interface Grammar {
  grammarObject: string; // Internal identifier
  rules: Rule[]; // List of grammar rules
  udts: UDT[]; // User-defined terminals (empty in this grammar)
  toString(): string; // Method to return the grammar in ABNF format
}

export interface Rule {
  name: string; // Rule name
  lower: string; // Lowercased rule name
  index: number; // Rule index
  isBkr: boolean; // Is this a back-reference?
  opcodes?: Opcode[]; // List of opcodes for the rule
}

export type Opcode =
  | { type: 1; children: number[] } // ALT (alternation)
  | { type: 2; children: number[] } // CAT (concatenation)
  | { type: 3; min: number; max: number } // REP (repetition)
  | { type: 4; index: number } // RNM (rule reference)
  | { type: 5; min: number; max: number } // TRG (terminal range)
  | { type: 6 | 7; string: number[] }; // TBS or TLS (byte sequence or literal string)

export type UDT = {}; // User-defined terminals (empty in this grammar)

/**
 * Errors
 */
export interface JSONPointerErrorOptions {
  readonly cause?: unknown;
  readonly [key: string]: unknown;
}

export declare class JSONPointerError extends Error {
  constructor(message?: string, options?: JSONPointerErrorOptions);
}
export declare class JSONPointerParseError extends JSONPointerError { }
export declare class JSONPointerCompileError extends JSONPointerError { }
export declare class JSONPointerEvaluateError extends JSONPointerError { }
export declare class JSONPointerTypeError extends JSONPointerEvaluateError {
  constructor(referenceToken: ReferenceToken, options?: JSONPointerErrorOptions);
}
export declare class JSONPointerKeyError extends JSONPointerEvaluateError {
  constructor(referenceToken: ReferenceToken, options?: JSONPointerErrorOptions);
}
export declare class JSONPointerIndexError extends JSONPointerEvaluateError { }
