//
// # smock
// ## A mocking utility for node.js require
//
//     Author: Daniel Koch <daniel@suitsoft.eu>
//     Version: 1.0.0
//

// Require node's `module` module that provides
// access to all the things `require()` uses
var Module = require('module');

// ## _load
// The original `module._load` function
var _load = void 0;

// ## cache
// The cache that contains mocks and suppressed imports
var cache = [];

// ## init
// Overwrites `Module._load` with a function that either
// returns a mocked value from the cache or whatever the original
// function returns if nothing has been mocked.
var init = function() {
    _load = Module._load;

    // Overwrite the original `_load` function
    // The important argument for us is `req` because its the
    // name of whatever was required.
    Module._load = function(req, parent, isMain) {

        // Take the cache...
        var mock = cache
                        // Find the tests that match ...
                        .filter(function(mockDef) {
                            var test = mockDef.test;

                            // If we have a regex we match it against the string
                            if( test instanceof RegExp )
                                return null !== req.match( test );

                            // If we have a function we let the
                            // function decide
                            if( 'function' === typeof test )
                                return !! test(req, parent, isMain);

                            // Last case: we simply have no idea
                            // Thus, we use a strict equal
                            return test === req;
                        })
                        // ... and grab the mocked value from it
                        .map( function(mockDef) {
                            return mockDef.value;
                        });

        // If we found a mocked import we return it.
        // We only use the first mock we find. Since the `createMock()` function
        // uses `Array.prototype.unshift` we always use the mock added at last.
        if( mock.length )
            return mock[0];

        // No mock; let the load system do its work
        return _load.apply(Module, arguments);
    };
};

// ## createMock
// Creates a mock with the given test, mocking with the given
// value and use the given type.
//
// - `test`  - Something that is used to compare. Might be a string, a function or something else
// - `value` - The mock value that replaces the original import
// - `type`  - Type, either `'mock'` or `'sup'`. This is used to remove it later on.
//
var createMock = function(test, value, type) {
    // Initialize the cache if not done already
    if( ! _load )
        init.call(this);

    // Push the new item to the front
    cache.unshift({
        test: test,
        value: value,
        _type: type
    })
};

// ## remove
// Removes a mock definition from the collection.
//
// - `test`  - Something that is used to compare. Might be a string, a function or something else
// - `type`  - Type, either `'mock'` or `'sup'`.
//
var remove = function(test, type) {
    // We want to use strict equals below thus
    // we use the string representation of RegExp's
    if( test instanceof RegExp )
            test = ('' + test);

    cache = cache.filter( function(def) {
            // If the type does not match we ignore it
            if( type !== def._type )
                return true;

            // Again, convert RegExp's if found
            var cmp = (def.test instanceof RegExp) ? '' + def.test : def.test;

            return test !== cmp;
        });
};

// ## removeAll
// Removes all mocks of the given type
//
// - `type`  - Type, either `'mock'` or `'sup'`.
//
var removeAll = function(type) {
    cache = cache.filter( function(item) {
        return item._type !== type;
    });
};

// ## Exports
module.exports = {

    // Provide access to the cache.
    // This is done to make the testing more reliable.
    get _cache() {
        return cache;
    },

    set _cache(what) {
        cache = what;
    },

    // ### mock
    // Mocks the given import with the given value.
    // `test` can be a **function** that is used to compare
    // whatever is required and returns `true` or `false`.
    // If the return value is truthy the import will be
    // mocked with the given value.
    //
    // The function's arguments are the same as with `Module._load`.
    // Most of the time you will look at the first argument, a `string`.
    //
    //     var mockStyles = (req) => 'style.css' === req;
    //     smock.mock( mockStyles, 'no css, dude.');
    //
    // `test` can also be a `RegExp` that is matched agains the name
    // of the import or a string. It can be anything else, too, if your
    // imports are gone totally crazy.
    //
    //     smock.mock( 'style.css', 'no css, dude.' );
    //
    //     smock.mock( /\.(css|scss|sass|less)/, 'no styles, dude.');
    //
    mock: function(test, value) {
        createMock(test, value, 'mock');
    },

    // ### suppress
    // Suppresses the given import. A suppressed import always
    // returns `undefined`.
    // The `test` argument is the same as used by [mock()](#section-25).
    //
    suppress: function(test) {
        createMock(test, void 0, 'sup');
    },

    // ### unmock
    // Removes the mock registered for the given `test`.
    // `unmock()` uses strict equal to compare the registered
    // mocks.
    unmock: function(test) {
        remove(test, 'mock');
    },

    // ### unsuppress
    // Removes the mock registered for the given `test`.
    // `unsuppress()` uses strict equal to compare the suppressed
    // imports.
    unsuppress: function(test) {
        remove(test, 'sup');
    },

    // ### unmockAll
    // Removes all mocks for imports
    unmockAll: function() {
        removeAll('mock');
    },

    // ### unsuppressAll
    // Removes all suppressed imports
    unsuppressAll: function() {
        removeAll('sup');
    }

};