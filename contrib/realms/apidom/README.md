# ApiDOM Evaluation Realm

Evaluation realm for [SpecLynx ApiDOM](https://github.com/speclynx/apidom) structures, used for OpenAPI and AsyncAPI processing.

## Requirements

```bash
npm install @speclynx/apidom-datamodel
```

## Usage

```js
import { evaluate } from '@swaggerexpert/json-pointer';
import { ObjectElement } from '@speclynx/apidom-datamodel';
import ApiDOMEvaluationRealm from './index.js';

const element = new ObjectElement({
  foo: ['bar', 'baz'],
  '': 0,
});

const realm = new ApiDOMEvaluationRealm();

evaluate(element, '/foo/0', { realm }); // => StringElement('bar')
evaluate(element, '/', { realm }); // => NumberElement(0)
```

## Features

- Supports `ObjectElement` and `ArrayElement` from ApiDOM
- Validates array indices as unsigned 32-bit integers
- Enforces unique member names in objects (as required by JSON Pointer spec)
- Works with refracted OpenAPI/AsyncAPI documents
