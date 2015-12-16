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

// The function that sets up mocking
var init = function() {
    _load = Module._load;

    // Overwrite the original _load function with
    // a function that uses the mocking rules
    Module._load = function(req, parent, isMain) {

        var mock = this._cache
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
    }.bind(this);
};

// Creates a mock
var createMock = function(test, value, type) {
    // Lazy initiation
    if( ! _load )
        init.call(this);

    // The last entry's always right
    this._cache.unshift({
        test: test,
        value: value,
        _type: type
    })
};

// Removes a mock definition from the collection
var remove = function(test, type) {
    if( test instanceof RegExp )
            test = ('' + test);

    this._cache = this._cache.filter( function(def) {
            if( type !== def._type )
                return true;

            // If we have a regex we make a string
            // to compare
            var cmp = (def.test instanceof RegExp) ? '' + def.test : def.test;

            return test !== cmp;
        });
};

var removeAll = function(type) {
    this._cache = this._cache.filter( function(item) {
        return item._type !== type;
    });
};

// Export
module.exports = {

    _cache: [],

    mock: function(test, value) {
        createMock.call(this, test, value, 'mock');
    },

    suppress: function(test) {
        createMock.call(this, test, void 0, 'sup');
    },

    unmock: function(test) {
        remove.call(this, test, 'mock');
    },

    unsuppress: function(test) {
        remove.call(this, test, 'sup');
    },

    unmockAll: function() {
        removeAll.call(this, 'mock');
    },

    unsuppressAll: function() {
        removeAll.call(this, 'sup');
    }

};