# Immutable.js Evaluation Realm

Evaluation realm for [Immutable.js](https://immutable-js.com/) data structures.

## Requirements

```bash
npm install immutable
```

## Usage

```js
import { evaluate } from '@swaggerexpert/json-pointer';
import { Map, List } from 'immutable';
import ImmutableEvaluationRealm from './index.js';

const structure = Map({
  foo: List(['bar', 'baz']),
  '': 0,
});

const realm = new ImmutableEvaluationRealm();

evaluate(structure, '/foo/0', { realm }); // => 'bar'
evaluate(structure, '/', { realm }); // => 0
```

## Features

- Supports `Map` and `List` from Immutable.js
- Seamless integration with immutable data structures
- Can be composed with other realms for mixed data structures
