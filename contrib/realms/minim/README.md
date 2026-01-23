# Minim Evaluation Realm

Evaluation realm for [Minim](https://github.com/refractproject/minim) element structures, commonly used in API description tools.

## Requirements

```bash
npm install minim
```

## Usage

```js
import { evaluate } from '@swaggerexpert/json-pointer';
import { ObjectElement } from 'minim';
import MinimEvaluationRealm from './index.js';

const element = new ObjectElement({
  foo: ['bar', 'baz'],
  '': 0,
});

const realm = new MinimEvaluationRealm();

evaluate(element, '/foo/0', { realm }); // => StringElement('bar')
evaluate(element, '/', { realm }); // => NumberElement(0)
```

## Features

- Supports `ObjectElement` and `ArrayElement` from minim
- Validates array indices as unsigned 32-bit integers
- Enforces unique member names in objects (as required by JSON Pointer spec)
