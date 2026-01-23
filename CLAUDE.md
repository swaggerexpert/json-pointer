# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install              # Install dependencies
npm run build            # Full build (grammar + ES + CJS + UMD browser bundles)
npm run grammar:compile  # Compile ABNF grammar to parser (src/grammar.bnf → src/grammar.js)
npm test                 # Run all tests with Mocha
npm test -- --grep "pattern"  # Run specific tests matching pattern
npm test -- test/parse/index.js  # Run a single test file
```

## Architecture

This is an RFC 6901 JSON Pointer implementation providing parsing, validation, evaluation, compilation, and representation.

### Core Pipeline

1. **Grammar** (`src/grammar.bnf`) - ABNF grammar defining JSON Pointer syntax, compiled via apg-js to `src/grammar.js`
2. **Parsing** (`src/parse/`) - Uses apg-lite parser generator with pluggable translators (AST, CST, XML)
3. **Evaluation** (`src/evaluate/`) - Traverses data structures using reference tokens with pluggable evaluation realms
4. **Compilation** (`src/compile.js`) - Converts unescaped reference tokens back to JSON Pointer string

### Evaluation Realms

The realm system (`src/evaluate/realms/`) enables polymorphic evaluation across different data structures:

- `json/` - Default realm for plain JS objects/arrays
- `map-set/` - Supports Map and Set instances
- `minim/` - For minim element structures (API description tools)
- `apidom/` - For ApiDOM structures (OpenAPI/AsyncAPI processing)
- `immutable/` - For Immutable.js structures
- `compose.js` - Composes multiple realms (order matters: specific before generic)

Custom realms extend `EvaluationRealm` base class implementing: `isArray`, `isObject`, `sizeOf`, `has`, `evaluate`.

### Parse Translators

Located in `src/parse/translators/`:
- `ASTTranslator` (default) - Returns array of unescaped reference tokens
- `CSTTranslator` - Returns concrete syntax tree with node positions
- `XMLTranslator` - Returns XML string representation

### Error Hierarchy

All errors extend `JSONPointerError`:
- `JSONPointerParseError` - Invalid pointer syntax
- `JSONPointerCompileError` - Invalid reference tokens during compilation
- `JSONPointerEvaluateError` - Base for evaluation errors
  - `JSONPointerTypeError` - Evaluating against non-object/non-array
  - `JSONPointerKeyError` - Object key not found
  - `JSONPointerIndexError` - Array index issues (out of bounds, invalid format, "-" token)

### Module Formats

The build produces three formats:
- `es/` - ES modules (.mjs)
- `cjs/` - CommonJS (.cjs)
- `dist/` - UMD browser bundles (json-pointer.browser.js, json-pointer.browser.min.js)

TypeScript types are in `types/index.d.ts`.
