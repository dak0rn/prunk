# prunk

prunk is a mocking utility for node.js `require()`. It allows you to
mock or suppress imports based on their name, regular expressions or
custom test functions.

[![Build Status](https://travis-ci.org/dak0rn/prunk.svg?branch=master)](https://travis-ci.org/dak0rn/prunk)
![Dependencies](https://img.shields.io/david/dak0rn/prunk.svg)
![Dev Dependencies](https://img.shields.io/david/dev/dak0rn/prunk.svg)

## Example

Given you have a React component you want to test. However, since
this component imports a SCSS file you cannot the import component directly.
At this point, you either can introduce a pre-compiler, loader or whatever
your test framework supports or you can simply mock the import.

```jsx
// MyComp.js
import { Component } from 'react';
import 'style.scss';

export default class Mycomp extends Component {
    // ...
}
```

```javascript
// MyComp.spec.js
const prunk = require('prunk');

prunk.mock('style.scss', 'no scss, dude.');
// or
prunk.mock( function(req) { return 'style.scss' === req; }, 'no scss, dude');
// or better
prunk.mock( /\.(css|scss|sass)$/, 'no styles, dude');

const MyComp = require('./MyComp');
```

In the test `require()` is used instead of `import` because some pre-compilers
move all imports to the top of the file and that would make the mocking impossible.
If you use mocha you can use [compiler](https://mochajs.org/#usage) for that.

If you just and to make sure some things don't get imported you can suppress them.
Then, they will always return `undefined`;

```javascript
// MyComp.spec.js
const prunk = require('prunk');

prunk.suppress('style.scss');
// or
prunk.suppress( function(req) { return 'style.scss' === req; } );
// or better
prunk.suppress( /\.(css|scss|sass)$/ );

const MyComp = require('./MyComp');
```

## API

### prunk.mock(test, value)

Mocks the given import with the given value.
`test` can be a **function** that is used to compare
whatever is required and returns `true` or `false`.
If the return value is truthy the import will be
mocked with the given value.

The function's arguments are the same as with `Module._load`.
Most of the time you will look at the first argument, a `string`.

    var mockStyles = (req) => 'style.css' === req;
    prunk.mock( mockStyles, 'no css, dude.');

`test` can also be a `RegExp` that is matched agains the name
of the import or a string. It can be anything else, too, if your
imports are gone totally crazy.

    prunk.mock( 'style.css', 'no css, dude.' );
    prunk.mock( /\.(css|scss|sass|less)/, 'no styles, dude.');

This function returns the prunk object so that you can chain calls.

    prunk.mock( ... )
         .mock( ... )
         .mock( ... );

### prunk.unmock(test)

Removes the mock registered for the given `test`.
`unmock()` uses strict equal to compare the registered
mocks.

This function returns the prunk object so that you can chain calls.

### prunk.unmockAll()

Removes all mocks.
This function returns the prunk object so that you can chain calls.

### prunk.suppress(test)

Suppresses all imports that matches the given `test`.
`test` can be a **function** that is used to compare
whatever is required and returns `true` or `false`.
If the return value is truthy the import will be suppressed
and thus returns `undefined`.

The function's arguments are the same as with `Module._load`.
Most of the time you will look at the first argument, a `string`.

    var mockStyles = (req) => 'style.css' === req;
    prunk.mock( mockStyles, 'no css, dude.');

`test` can also be a `RegExp` that is matched agains the name
of the import or a string or something else.

    prunk.mock( 'style.css', 'no css, dude.' );
    prunk.mock( /\.(css|scss|sass|less)/, 'no styles, dude.');

This function returns the prunk object so that you can chain calls.

### prunk.unsuppress(test)

Removes the mock registered for the given `test`.
`unsuppress()` uses strict equal to compare the suppressed
imports.
This function returns the prunk object so that you can chain calls.

### prunk.unsuppressAll()

Removes all suppressed imports.
This function returns the prunk object so that you can chain calls.

## Documentation

[Documented source](https://dak0rn.github.io/prunk/).