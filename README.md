# @swaggerexpert/json-pointer

[![npmversion](https://img.shields.io/npm/v/%40swaggerexpert%2Fjson-pointer?style=flat-square&label=npm%20package&color=%234DC81F&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40swaggerexpert%2Fjson-pointer)](https://www.npmjs.com/package/@swaggerexpert/json-pointer)
[![npm](https://img.shields.io/npm/dm/@swaggerexpert/json-pointer)](https://www.npmjs.com/package/@swaggerexpert/json-pointer)
[![Test workflow](https://github.com/swaggerexpert/json-pointer/actions/workflows/test.yml/badge.svg)](https://github.com/swaggerexpert/json-pointer/actions)
[![Dependabot enabled](https://img.shields.io/badge/Dependabot-enabled-blue.svg)](https://dependabot.com/)
[![try on RunKit](https://img.shields.io/badge/try%20on-RunKit-brightgreen.svg?style=flat)](https://npm.runkit.com/@swaggerexpert/json-pointer)
[![Tidelift](https://tidelift.com/badges/package/npm/@swaggerexpert%2Fjson-pointer)](https://tidelift.com/subscription/pkg/npm-.swaggerexpert-json-pointer?utm_source=npm-swaggerexpert-json-pointer&utm_medium=referral&utm_campaign=readme)

`@swaggerexpert/json-pointer` is a **parser**, **validator**, **evaluator**, **compiler** and **representer** for [RFC 6901](https://datatracker.ietf.org/doc/html/rfc6901) JavaScript Object Notation (JSON) Pointer.


<table>
  <tr>
    <td align="right" valign="middle">
        <img src="https://cdn2.hubspot.net/hubfs/4008838/website/logos/logos_for_download/Tidelift_primary-shorthand-logo.png" alt="Tidelift" width="60" />
      </td>
      <td valign="middle">
        <a href="https://tidelift.com/subscription/pkg/npm-.swaggerexpert-json-pointer?utm_source=npm-swaggerexpert-json-pointer&utm_medium=referral&utm_campaign=readme">
            Get professionally supported @swaggerexpert/json-pointer with Tidelift Subscription.
        </a>
      </td>
  </tr>
</table>

## Table of Contents

- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Parsing](#parsing)
    - [Validation](#validation)
    - [Escaping](#escaping)
    - [Evaluation](#evaluation)
    - [Compilation](#compilation)
    - [Representation](#representation)
    - [Errors](#errors)
    - [Grammar](#grammar)
- [More about JSON Pointer](#more-about-json-pointer)
- [License](#license)


## Getting started

### Installation

You can install `@swaggerexpert/json-pointer` using `npm`:

```sh
 $ npm install @swaggerexpert/json-pointer
```

### Usage

`@swaggerexpert/json-pointer` currently supports **parsing**, **validation** ,**evaluation**, **compilation** and **representation**.
Both parser and validator are based on a superset of [ABNF](https://www.rfc-editor.org/rfc/rfc5234) ([SABNF](https://cs.github.com/ldthomas/apg-js2/blob/master/SABNF.md))
and use [apg-lite](https://github.com/ldthomas/apg-lite) parser generator.

#### Parsing

Parsing a JSON Pointer is as simple as importing the **parse** function and calling it.

```js
import { parse } from '@swaggerexpert/json-parse';

const parseResult = parse('/foo/bar');
```

**parseResult** variable has the following shape:

```
{
  result: {
    success: true,
    state: 101,
    stateName: 'MATCH',
    length: 8,
    matched: 8,
    maxMatched: 8,
    maxTreeDepth: 8,
    nodeHits: 49
  },
  ast: fnast {
    callbacks: [
      'json-pointer': [Function: jsonPointer],
      'reference-token': [Function: referenceToken]
    ],
    init: [Function (anonymous)],
    ruleDefined: [Function (anonymous)],
    udtDefined: [Function (anonymous)],
    down: [Function (anonymous)],
    up: [Function (anonymous)],
    translate: [Function (anonymous)],
    setLength: [Function (anonymous)],
    getLength: [Function (anonymous)],
    toXml: [Function (anonymous)]
  },
  computed: [ 'foo', 'bar' ]
}
```

###### Evaluating AST as list of unescaped reference tokens

One of the ways to interpret the parsed JSON Pointer is to evaluate it as a list of unescaped reference tokens.

```js
import { parse } from '@swaggerexpert/json-parse';

const { computed } = parse('/foo/bar'); // computed = ['foo', 'bar']
```

###### Interpreting AST as list of entries

```js
import { parse } from '@swaggerexpert/json-parse';

const parseResult = parse('/foo/bar');
const parts = [];

parseResult.ast.translate(parts);
```

After running the above code, **parts** variable has the following shape:

```js
[
  ['json-pointer', '/foo/bar'],
  ['reference-token', 'foo'],
  ['reference-token', 'bar'],
]
```

###### Interpreting AST as XML

```js
import { parse } from '@swaggerexpert/json-pointer';

const parseResult = parse('/foo/bar');
const xml = parseResult.ast.toXml();
```

After running the above code, **xml** variable has the following content:

```xml
<?xml version="1.0" encoding="utf-8"?>
<root nodes="3" characters="8">
  <!-- input string -->
  /foo/bar
  <node name="json-pointer" index="0" length="8">
    /foo/bar
    <node name="reference-token" index="1" length="3">
      foo
    </node><!-- name="reference-token" -->
    <node name="reference-token" index="5" length="3">
      bar
    </node><!-- name="reference-token" -->
  </node><!-- name="json-pointer" -->
</root>
```

> NOTE: AST can also be traversed in classical way using [depth first traversal](https://www.tutorialspoint.com/data_structures_algorithms/depth_first_traversal.htm). For more information about this option please refer to [apg-js](https://github.com/ldthomas/apg-js) and [apg-js-examples](https://github.com/ldthomas/apg-js-examples).

#### Validation

Validating a JSON Pointer is as simple as importing one of the validation functions and calling it.

```js
import {
  testJSONPointer,
  testReferenceToken,
  testArrayLocation,
  testArrayIndex,
  testArrayDash
} from '@swaggerexpert/json-pointer';

testJSONPointer('/foo/bar'); // => true
testReferenceToken('foo'); // => true
testArrayLocation('0'); // => true
testArrayLocation('-'); // => true
testArrayIndex('0'); // => true
testArrayDash('-'); // => true
```

#### Escaping

[comment]: <> (SPDX-FileCopyrightText: Copyright &#40;c&#41; 2013 IETF Trust and the persons identified as the document authors.  All rights reserved.)
[comment]: <> (SPDX-License-Identifier: BSD-2-Clause)

Because the characters `'~'` (%x7E) and `'/'` (%x2F) have special
meanings in JSON Pointer, `'~'` needs to be encoded as `'~0'` and `'/'`
needs to be encoded as `'~1'` when these characters appear in a
reference token.

```js
import { escape } from '@swaggerexpert/json-pointer';

escape('~foo'); // => '~0foo'
escape('/foo'); // => '~1foo'
```

[comment]: <> (SPDX-FileCopyrightText: Copyright &#40;c&#41; 2013 IETF Trust and the persons identified as the document authors.  All rights reserved.)
[comment]: <> (SPDX-License-Identifier: BSD-2-Clause)

Unescape is performed by first transforming any
occurrence of the sequence `'~1'` to `'/'`, and then transforming any
occurrence of the sequence `'~0'` to `'~'`.  By performing the
substitutions in this order, this library avoids the error of
turning `'~01'` first into `'~1'` and then into `'/'`, which would be
incorrect (the string `'~01'` correctly becomes `'~1'` after transformation).

```js
import { unescape } from '@swaggerexpert/json-pointer';

unescape('~0foo'); // => '~foo'
unescape('~1foo'); // => '/foo'
```

#### Evaluation

[comment]: <> (SPDX-FileCopyrightText: Copyright &#40;c&#41; 2013 IETF Trust and the persons identified as the document authors.  All rights reserved.)
[comment]: <> (SPDX-License-Identifier: BSD-2-Clause)

Evaluation of a JSON Pointer begins with a reference to the root
value of a JSON document and completes with a reference to some value
within the document.  Each reference token in the JSON Pointer is
evaluated sequentially.

```js
import { evaluate } from '@swaggerexpert/json-pointer';

const value = {
  "foo": ["bar", "baz"],
  "": 0,
  "a/b": 1,
  "c%d": 2,
  "e^f": 3,
  "g|h": 4,
  "i\\j": 5,
  "k\"l": 6,
  " ": 7,
  "m~n": 8
};

evaluate(value, ''); // => identical to value
evaluate(value, '/foo'); // => ["bar", "baz"]
evaluate(value, '/foo/0'); // => "bar"
evaluate(value, '/'); // => 0
evaluate(value, '/a~1b'); // => 1
evaluate(value, '/c%d'); // => 2
evaluate(value, '/e^f'); // => 3
evaluate(value, '/g|h'); // => 4
evaluate(value, '/i\\j'); // => 5
evaluate(value, '/k"l'); // => 6
evaluate(value, '/ '); // => 7
evaluate(value, '/m~0n'); // => 8

// neither object nor array
evaluate(null, '/foo'); // => throws JSONPointerTypeError
// arrays
evaluate(value, '/foo/2'); // => throws JSONPointerIndexError
evaluate(value, '/foo/-'); // => throws JSONPointerIndexError
evaluate(value, '/foo/a'); // => throws JSONPointerIndexError
// objects
evaluate(value, '/bar'); // => throws JSONPointerKeyError
```

###### Strict Arrays

[comment]: <> (SPDX-FileCopyrightText: Copyright &#40;c&#41; 2013 IETF Trust and the persons identified as the document authors.  All rights reserved.)
[comment]: <> (SPDX-License-Identifier: BSD-2-Clause)

By default, the evaluation is **strict**, meaning error condition will be raised if it fails to
resolve a concrete value for any of the JSON pointer's reference tokens. For example, if an array
is referenced with a non-numeric token, an error condition will be raised.

Note that the use of the `"-"` character to index an array will always
result in such an error condition because by definition it refers to
a nonexistent array element.

This spec compliant strict behavior can be disabled by setting the `strictArrays` option to `false`.

```js
evaluate(value, '/foo/2', { strictArrays: false }); // => undefined
evaluate(value, '/foo/-', { strictArrays: false }); // => undefined
evaluate(value, '/foo/a', { strictArrays: false }); // => undefined
```

###### Strict Objects

[comment]: <> (SPDX-FileCopyrightText: Copyright &#40;c&#41; 2013 IETF Trust and the persons identified as the document authors.  All rights reserved.)
[comment]: <> (SPDX-License-Identifier: BSD-2-Clause)

By default, the evaluation is **strict**, meaning error condition will be raised if it fails to
resolve a concrete value for any of the JSON pointer's reference tokens. For example,
if a token references a key that is not present in an object, an error condition will be raised.

This spec compliant strict behavior can be disabled by setting the `strictObjects` option to `false`.

```js
evaluate(value, '/bar', { strictObjects: false }); // => undefined
```

`strictObjects` options has no effect in cases where evaluation of previous
reference token failed to resolve a concrete value.

```js
evaluate(value, '/bar/baz', { strictObjects: false }); // => throw JSONPointerTypeError
```

##### Evaluation Realms

An **evaluation realm** defines the rules for interpreting and navigating data structures in JSON Pointer evaluation.
While JSON Pointer traditionally operates on JSON objects and arrays, evaluation realms allow the evaluation to work
polymorphically with different data structures, such as [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map),
[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), [Immutable.js](https://immutable-js.com/),
or even custom representations like [ApiDOM](https://github.com/swagger-api/apidom).
Realm can be specified via the `realm` option in the `evalute()` function.

###### JSON Evaluation Realm

By default, the evaluation operates under the **JSON realm**, which assumes that:

- **Arrays** are indexed numerically.
- **Objects** (plain JavaScript objects) are accessed by string keys.

The default realm is represented by the `JSONEvaluationRealm` class.

```js
import { evaluate } from '@swaggerexpert/json-pointer';

evaluate({ a: 'b' }, '/a'); // => 'b'
```

is equivalent to:

```js
import { evaluate } from '@swaggerexpert/json-pointer';
import JSONEvaluationRealm from '@swaggerexpert/json-pointer/evaluate/realms/json';

evaluate({ a: 'b' }, '/a', { realm: new JSONEvaluationRealm() }); // => 'b'
```

###### Map/Set Evaluation Realm

The Map/Set realm extends JSON Pointer evaluation to support [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) instances,
allowing structured traversal and access beyond traditional JavaScript objects and arrays.
Map/Set realm is represented by the `MapSetEvaluationRealm` class.


```js
import { evaluate } from '@swaggerexpert/json-pointer';
import MapSetEvaluationRealm from '@swaggerexpert/json-pointer/evaluate/realms/map-set';

const map = new Map([
  ['a', new Set(['b', 'c'])]
]);

evaluate(map, '/a/1', { realm: new MapSetEvaluationRealm() }); // => 'c'
```

###### Custom Evaluation Realms

The evaluation is designed to support **custom evaluation realms**,
enabling JSON Pointer evaluation for **non-standard data structures**.

A valid custom evaluation realm must match the structure of the `EvaluationRealm` interface.

```ts
interface EvaluationRealm {
  readonly name: string;

  isArray(node: unknown): boolean;
  isObject(node: unknown): boolean;
  sizeOf(node: unknown): number;
  has(node: unknown, referenceToken: string): boolean;
  evaluate(node: unknown, referenceToken: string): unknown;
}
```

One way to create a custom realm is to extend the `EvaluationRealm` class and implement the required methods.

```js
import { evaluate, EvaluationRealm } from '@swaggerexpert/json-pointer';

class CustomEvaluationRealms extends EvaluationRealm {
  name = 'cusotm';

  isArray(node) { ... }
  isObject(node) { ... }
  sizeOf(node) { ... }
  has(node, referenceToken) { ... }
  evaluate(node, referenceToken) { ... }
}

evaluate({ a: 'b' }, '/a', { realm: new CustomEvaluationRealms() }); // => 'b'
```

###### Composing Evaluation Realms

Evaluation realms can be composed to create complex evaluation scenarios,
allowing JSON Pointer evaluation to work across multiple data structures in a seamless manner.
By combining different realms, composite evaluation ensures that a JSON Pointer query can
resolve correctly whether the data structure is an object, array, Map, Set, or any custom type.

When composing multiple evaluation realms, the **order matters**. The composition is performed from left to right, meaning:

- More specific realms should be placed first (leftmost position).
- More generic realms should be placed later (rightmost position).

This ensures that specialized data structures (e.g., Map, Set, Immutable.js) take precedence over generic JavaScript objects and arrays.

```js
import { composeRealms, evaluate } from '@swaggerexpert/json-pointer';
import JSONEvaluationRealm from '@swaggerexpert/json-pointer/realms/json';
import MapSetEvaluationRealm from '@swaggerexpert/json-pointer/realms/map-set';

const compositeRealm = composeRealms(new MapSetEvaluationRealm(), new JSONEvaluationRealm());

const structure = [
  {
    a: new Map([
      ['b', new Set(['c', 'd'])]
    ]),
  },
];

evaluate(structure, '/0/a/b/1', { realm : compositeRealm }); // => 'd'
```

#### Compilation

Compilation is the process of transforming a list of reference tokens into a JSON Pointer.
Reference tokens are escaped before compiled into a JSON Pointer.

```js
import { compile } from '@swaggerexpert/json-pointer';

compile(['~foo', 'bar']); // => '/~0foo/bar'
```

#### Representation

##### JSON String

[comment]: <> (SPDX-FileCopyrightText: Copyright &#40;c&#41; 2013 IETF Trust and the persons identified as the document authors.  All rights reserved.)
[comment]: <> (SPDX-License-Identifier: BSD-2-Clause)

A JSON Pointer can be represented in a JSON string value. Per
[RFC4627, Section 2.5](https://datatracker.ietf.org/doc/html/rfc4627#section-2.5), all instances of quotation mark `'"'` (%x22),
reverse solidus `'\'` (%x5C), and control (%x00-1F) characters MUST be
escaped.

```js
import { JSONString } from '@swaggerexpert/json-pointer';

JSONString.to('/foo"bar'); // => '"/foo\\"bar"'
JSONString.from('"/foo\\"bar"'); // => '/foo"bar'
```

##### URI Fragment Identifier

[comment]: <> (SPDX-FileCopyrightText: Copyright &#40;c&#41; 2013 IETF Trust and the persons identified as the document authors.  All rights reserved.)
[comment]: <> (SPDX-License-Identifier: BSD-2-Clause)

A JSON Pointer can be represented in a URI fragment identifier by
encoding it into octets using UTF-8 [RFC3629](https://datatracker.ietf.org/doc/html/rfc3629), while percent-encoding
those characters not allowed by the fragment rule in [RFC3986](https://datatracker.ietf.org/doc/html/rfc3986).

```js
import { URIFragmentIdentifier } from '@swaggerexpert/json-pointer';

URIFragmentIdentifier.to('/foo"bar'); // => '#/foo%22bar'
URIFragmentIdentifier.from('#/foo%22bar'); // => '/foo"bar'
```

#### Errors

`@swaggerexpert/json-pointer` provides a structured error class hierarchy,
enabling precise error handling across JSON Pointer operations, including parsing, evaluation ,compilation and validation.

```js
import {
  JSONPointerError,
  JSONPointerParseError,
  JSONPointerCompileError,
  JSONPointerEvaluateError,
  JSONPointerTypeError,
  JSONPointerKeyError,
  JSONPointerIndexError
} from '@swaggerexpert/json-pointer';
```

**JSONPointerError** is the base class for all JSON Pointer errors.

#### Grammar

New grammar instance can be created in following way:

```js
import { Grammar } from '@swaggerexpert/json-pointer';

const grammar = new Grammar();
```

To obtain original ABNF (SABNF) grammar as a string:

```js
import { Grammar } from '@swaggerexpert/json-pointer';

const grammar = new Grammar();

grammar.toString();
// or
String(grammar);
```

## More about JSON Pointer

JSON Pointer is defined by the following [ABNF](https://tools.ietf.org/html/rfc5234) syntax

[comment]: <> (SPDX-FileCopyrightText: Copyright &#40;c&#41; 2013 IETF Trust and the persons identified as the document authors.  All rights reserved.)
[comment]: <> (SPDX-License-Identifier: BSD-2-Clause)

```abnf
; JavaScript Object Notation (JSON) Pointer ABNF syntax
; https://datatracker.ietf.org/doc/html/rfc6901
json-pointer    = *( "/" reference-token )
reference-token = *( unescaped / escaped )
unescaped       = %x00-2E / %x30-7D / %x7F-10FFFF
                ; %x2F ('/') and %x7E ('~') are excluded from 'unescaped'
escaped         = "~" ( "0" / "1" )
                ; representing '~' and '/', respectively

; https://datatracker.ietf.org/doc/html/rfc6901#section-4
array-location  = array-index / array-dash
array-index     = %x30 / ( %x31-39 *(%x30-39) )
                ; "0", or digits without a leading "0"
array-dash      = "-"
```

## License

`@swaggerexpert/json-pointer` is licensed under [Apache 2.0 license](https://github.com/swaggerexpert/json-pointer/blob/main/LICENSE).
`@swaggerexpert/json-pointer` comes with an explicit [NOTICE](https://github.com/swaggerexpert/json-pointer/blob/main/NOTICE) file
containing additional legal notices and information.
