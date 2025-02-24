# @swaggerexpert/json-pointer

[![npmversion](https://img.shields.io/npm/v/%40swaggerexpert%2Fjson-pointer?style=flat-square&label=npm%20package&color=%234DC81F&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40swaggerexpert%2Fjson-pointer)](https://www.npmjs.com/package/@swaggerexpert/json-pointer)
[![npm](https://img.shields.io/npm/dm/@swaggerexpert/json-pointer)](https://www.npmjs.com/package/@swaggerexpert/json-pointer)
[![Test workflow](https://github.com/swaggerexpert/json-pointer/actions/workflows/test.yml/badge.svg)](https://github.com/swaggerexpert/json-pointer/actions)
[![Dependabot enabled](https://img.shields.io/badge/Dependabot-enabled-blue.svg)](https://dependabot.com/)
[![try on RunKit](https://img.shields.io/badge/try%20on-RunKit-brightgreen.svg?style=flat)](https://npm.runkit.com/@swaggerexpert/json-pointer)
[![Tidelift](https://tidelift.com/badges/package/npm/@swaggerexpert%2Fjson-pointer)](https://tidelift.com/subscription/pkg/npm-.swaggerexpert-json-pointer?utm_source=npm-swaggerexpert-json-pointer&utm_medium=referral&utm_campaign=readme)

`@swaggerexpert/json-pointer` is a **parser**, **validator**, **escaper**, **evaluator**, **compiler** and **representer** for [RFC 6901 JavaScript Object Notation (JSON) Pointer](https://datatracker.ietf.org/doc/html/rfc6901).

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

#### Compilation

Compilation is the process of transforming a list of reference tokens into a JSON Pointer.
Reference tokens are escaped before compiled into a JSON Pointer.

```js
import { compile } from '@swaggerexpert/json-pointer';

compile(['~foo', 'bar']); // => '/~0foo/bar'
```

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
