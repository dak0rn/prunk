//
// smock
//
// A small mocking utility for node.js require
//
// Author: Daniel Koch <daniel@suitsoft.eu>
//
var Module = require('module');

// The original module._load function
var _load = void 0;

// The cache
var cache = [];

// The function that sets up mocking
var init = function() {
    _load = Module._load;

    // Overwrite the original _load function with
    // a function that uses the mocking rules
    Module._load = function(req, parent, isMain) {

        var mock = cache
                        .filter(function(mockDef) {
                            var test = mockDef.test;

                            // If we have a regex we match
                            // it against the string
                            if( test instanceof RegExp )
                                return null !== req.match( test );

                            // If we have a function we let the
                            // function decide
                            if( 'function' === typeof test )
                                return !! test(req, parent, isMain);

                            // Last case: we simply have no idea
                            return test === req;
                        })
                        .map( function(mockDef) {
                            return mockDef.value;
                        });

        // Found a mock?
        if( mock.length )
            return mock[0];

        // No mock; continue as usual
        return _load.apply(Module, arguments);
    };
};

// Export
module.exports = {

    mock: function(what, value) {
        // Lazy initiation
        if( ! _load )
            init();

        // Add an item to the cache
        cache.push({
            test: what,
            value: value
        });
    },

    suppress: function() {},

    unmock: function() {},

    unsuppress: function() {},

    unmockAll: function() {},

    unsuppressAll: function() {}

};