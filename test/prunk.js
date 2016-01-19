/**
 * Tests for prunk
 *
 */
var expect = require('chai').expect;
var prunk;

// Export
describe('Export', function() {

    before(function() {
        prunk = require('..');
    });

    it('should be an object', function() {
        expect( prunk ).to.be.an('object');
    });

    it('should have a mock() function', function() {
        expect( prunk.mock ).to.be.a('function')
    })

    it('should have a suppress() function', function() {
       expect( prunk.suppress ).to.be.a('function');
    });

    it('should have a unmock() function', function() {
       expect( prunk.unmock ).to.be.a('function');
    });

    it('should have a unsuppress() function', function() {
       expect( prunk.unsuppress ).to.be.a('function');
    });

    it('should have a unmockAll() function', function() {
       expect( prunk.unmockAll ).to.be.a('function');
    });

    it('should have a unsuppressAll() function', function() {
       expect( prunk.unsuppressAll ).to.be.a('function');
    });

});

// mock function
describe('mock()', function() {

    beforeEach(function() {
        // Reset the require cache
        require.cache = {};
        prunk = require('..');
        prunk._cache = [];
    });

    it('should take two arguments', function() {
        expect(prunk.mock.length).to.equal(2);
    });

    it('should mock correctly with a string', function() {
        prunk.mock('blah', 42);

        var imp = require('blah');
        expect( imp ).to.equal(42);
    });

    it('should mock correctly with a regex', function() {
        prunk.mock(/^blah/, 42);

        ['blah', 'blah1', 'blah2', 'blahblah'].forEach(function(str) {
            var imp = require(str);
            expect(imp).to.equal(42);
        });
    });

    it('should mock correctly using callbacks', function() {
        var filter = function(str) { return 0 === str.indexOf('blah'); };
        prunk.mock(filter, 42);

        ['blah', 'blah1', 'blah2', 'blahblah'].forEach(function(str) {
            var imp = require(str);
            expect(imp).to.equal(42);
        });
    });

    it('should mock if invoked after suppress', function() {
        prunk.suppress('bash');
        prunk.mock('bash', 'success');

        expect( require('bash') ).to.equal('success');
    });

    it('should return the prunk object again', function() {
        expect( prunk.mock() ).to.equal( prunk );
    });

});


// unmock function
describe('unmock()', function() {

    beforeEach(function() {
        // Reset the require cache
        require.cache = {};
        prunk = require('..');
        prunk._cache = [];
    });

    it('should take one argument', function() {
        expect(prunk.unmock.length).to.equal(1);
    });

    it('should unmock correctly when using a string', function() {
        prunk.mock('unmockblah', 77);
        prunk.unmock('unmockblah');

        var fn = require.bind(this, 'unmockblah');
        expect( fn ).to.throw();
    });

    it('should unmock correctly when unsing a regex', function() {
        prunk.mock(/^regexblah/, 81);
        prunk.unmock(/^regexblah/);

        ['regexblah', 'regexblah1', 'regexblah2', 'regexblahblah'].forEach(function(str) {
            var fn = require.bind(this, str);
            expect( fn ).to.throw();
        });
    });

    it('should unmock correctly using callbacks', function() {
        var filter = function(str) { return 0 === str.indexOf('blub'); };
        prunk.mock(filter, 42);
        prunk.unmock( filter );

        ['blub', 'blub1', 'blub2', 'blubblah'].forEach(function(str) {
            var fn = require.bind(this, str);
            expect( fn ).to.throw();
        });
    });

    it('should keep the suppressed things', function() {
        prunk.suppress('supmepls');
        prunk.unmock('supmepls');

        expect( require('supmepls') ).to.be.undefined;
    });

    it('should return the prunk object again', function() {
        expect( prunk.unmock() ).to.equal( prunk );
    });
});

// unmockAll function
describe('unmockAll()', function() {

    beforeEach(function() {
        // Reset the require cache
        require.cache = {};
        prunk = require('..');
        prunk._cache = [];
    });

    it('should take no arguments', function() {
        expect(prunk.unmockAll.length).to.equal(0);
    });

    it('should unmock all correctly when using a string', function() {
        prunk.mock('unmockallblah', '_s3');
        prunk.unmockAll();

        var fn = require.bind(this, 'unmockallblah');
        expect( fn ).to.throw();
    });

    it('should unmock all correctly when unsing a regex', function() {
        prunk.mock(/^foobar/, 13);
        prunk.unmockAll();

        ['foobar', 'foobar1', 'foobar2', 'foobarblah'].forEach(function(str) {
            var fn = require.bind(this, str);
            expect(fn).to.throw();
        });
    });

    it('should unmock correctly using callbacks', function() {
        var filter = function(str) { return 0 === str.indexOf('blub'); };
        prunk.mock(filter, 42);
        prunk.unmockAll();

        ['blub', 'blub1', 'blub2', 'blubblah'].forEach(function(str) {
            var fn = require.bind(this, str);
            expect( fn ).to.throw();
        });
    });

    it('should keep all suppressed things', function() {
        prunk.suppress('supAll1');
        prunk.suppress('supAll2');
        prunk.suppress('supAll3');

        prunk.unmockAll();

        ['supAll3', 'supAll2', 'supAll1'].forEach( function(what) {
            expect( require(what) ).to.be.undefined;
        });
    });

    it('should return the prunk object again', function() {
        expect( prunk.unmockAll() ).to.equal( prunk );
    });
});

// suppress() function
describe('suppress()', function() {

    beforeEach(function() {
        // Reset the require cache
        require.cache = {};
        prunk = require('..');

        // Make sure, the internal cache is empty
        prunk._cache = [];
    });

    it('should take one argument', function() {
        expect(prunk.suppress.length).to.equal(1);
    });

    it('should suppress correctly when using a string', function() {
        prunk.suppress('suppressblah');

        var imp = require('suppressblah');
        expect( imp ).to.be.undefined;
    });

    it('should suppress correctly when unsing a regex', function() {
        prunk.suppress(/^regexblah/);

        ['regexblah', 'regexblah1', 'regexblah2', 'regexblahblah'].forEach(function(str) {
            var imp = require(str);
            expect(imp).to.be.undefined;
        });
    });

    it('should suppress correctly using callbacks', function() {
        var filter = function(str) { return 0 === str.indexOf('blub'); };
        prunk.suppress( filter );

        ['blub', 'blub1', 'blub2', 'blubblah'].forEach(function(str) {
            var imp = require(str);
            expect(imp).to.be.undefined;
        });
    });

    it('should suppress if invoked after mock', function() {
        prunk.mock('fish', 'failed');
        prunk.suppress('fish');

        expect( require('fish') ).to.be.undefined;
    });

    it('should return the prunk object again', function() {
        expect( prunk.suppress() ).to.equal( prunk );
    });
});

// unsuppress function
describe('unsuppress()', function() {

    beforeEach(function() {
        // Reset the require cache
        require.cache = {};
        prunk = require('..');
        prunk._cache = [];
    });

    it('should take one argument', function() {
        expect(prunk.unsuppress.length).to.equal(1);
    });

    it('should unsuppress correctly when using a string', function() {
        prunk.suppress('unmockblah');
        prunk.unsuppress('unmockblah');

        var fn = require.bind(this, 'unmockblah');
        expect( fn ).to.throw();
    });

    it('should unsuppress correctly when unsing a regex', function() {
        prunk.suppress(/^regexblah/);
        prunk.unsuppress(/^regexblah/);

        ['regexblah', 'regexblah1', 'regexblah2', 'regexblahblah'].forEach(function(str) {
            var fn = require.bind(this, str);
            expect( fn ).to.throw();
        });
    });

    it('should unsuppress correctly using callbacks', function() {
        var filter = function(str) { return 0 === str.indexOf('blub'); };
        prunk.suppress(filter);
        prunk.unsuppress( filter );

        ['blub', 'blub1', 'blub2', 'blubblah'].forEach(function(str) {
            var fn = require.bind(this, str);
            expect( fn ).to.throw();
        });
    });

    it('should keep the mocked stuff', function() {
        prunk.mock('keepmepls', 0.4);
        prunk.unsuppress('keepmepls');

        expect( require('keepmepls') ).to.equal(0.4);
    });

    it('should return the prunk object again', function() {
        expect( prunk.unsuppress() ).to.equal( prunk );
    });
});

// unsuppressAll function
describe('unsuppressAll()', function() {

    beforeEach(function() {
        // Reset the require cache
        require.cache = {};
        prunk = require('..');
        prunk._cache = [];
    });

    it('should take no arguments', function() {
        expect(prunk.unsuppressAll.length).to.equal(0);
    });

    it('should unsuppressAll correctly when using a string', function() {
        prunk.suppress('unmockAllblah');
        prunk.unsuppressAll();

        var fn = require.bind(this, 'unmockAllblah');
        expect( fn ).to.throw();
    });

    it('should unsuppressAll correctly when unsing a regex', function() {
        prunk.suppress(/^regexAllblah/);
        prunk.unsuppressAll();

        ['regexAllblah', 'regexAllblah1', 'regexAllblah2', 'regexAllblahblah'].forEach(function(str) {
            var fn = require.bind(this, str);
            expect( fn ).to.throw();
        });
    });

    it('should unsuppressAll correctly using callbacks', function() {
        var filter = function(str) { return 0 === str.indexOf('impAll'); };
        prunk.suppress(filter);
        prunk.unsuppressAll( );

        ['impAll', 'impAll1', 'impAll2', 'impAllblah'].forEach(function(str) {
            var fn = require.bind(this, str);
            expect( fn ).to.throw();
        });
    });

    it('should keep all mocked things', function() {
        prunk.mock('mockAll1', '$$mocked');
        prunk.mock('mockAll2', '$$mocked');
        prunk.mock('mockAll3', '$$mocked');

        prunk.unsuppressAll();

        ['mockAll3', 'mockAll2', 'mockAll1'].forEach( function(what) {
            expect( require(what) ).to.equal('$$mocked');
        });
    });

    it('should return the prunk object again', function() {
        expect( prunk.unsuppressAll() ).to.equal( prunk );
    });
});