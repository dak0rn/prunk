/**
 * Tests for smock
 *
 */
var expect = require('chai').expect;
var smock;

// Export
describe('Export', function() {

    before(function() {
        smock = require('..');
    });

    it('should be an object', function() {
        expect( smock ).to.be.an('object');
    });

    it('should have a mock() function', function() {
        expect( smock.mock ).to.be.a('function')
    })

    it('should have a suppress() function', function() {
       expect( smock.suppress ).to.be.a('function');
    });

    it('should have a unmock() function', function() {
       expect( smock.unmock ).to.be.a('function');
    });

    it('should have a unsuppress() function', function() {
       expect( smock.unsuppress ).to.be.a('function');
    });

    it('should have a unmockAll() function', function() {
       expect( smock.unmockAll ).to.be.a('function');
    });

    it('should have a unsuppressAll() function', function() {
       expect( smock.unsuppressAll ).to.be.a('function');
    });

});

// mock function
describe('mock()', function() {

    beforeEach(function() {
        // Reset the require cache
        require.cache = {};
        smock = require('..');
    });

    it('should take two arguments', function() {
        expect(smock.mock.length).to.equal(2);
    });

    it('should mock correctly with a string', function() {
        smock.mock('blah', 42);

        var imp = require('blah');
        expect( imp ).to.equal(42);
    });

    it('should mock correctly with a regex', function() {
        smock.mock(/^blah/, 42);

        ['blah', 'blah1', 'blah2', 'blahblah'].forEach(function(str) {
            var imp = require(str);
            expect(imp).to.equal(42);
        });
    });

    it('should correctly mock using callbacks', function() {
        var filter = function(str) { return 0 === str.indexOf('blah'); };
        smock.mock(filter, 42);

        ['blah', 'blah1', 'blah2', 'blahblah'].forEach(function(str) {
            var imp = require(str);
            expect(imp).to.equal(42);
        });
    });

});

describe('unmock()', function() {

    beforeEach(function() {
        // Reset the require cache
        require.cache = {};
        smock = require('..');
    });

    it('should take one argument', function() {
        expect(smock.unmock.length).to.equal(1);
    });

    it('should unmock correctly when using a string', function() {
        smock.mock('unmockblah', 77);
        smock.unmock('unmockblah');

        var fn = require.bind(this, 'unmockblah');
        expect( fn ).to.throw();
    });

    it('should unmock correctly when unsing a regex', function() {
        smock.mock(/^regexblah/, 81);
        smock.unmock(/^regexblah/);

        ['regexblah', 'regexblah1', 'regexblah2', 'regexblahblah'].forEach(function(str) {
            var fn = require.bind(this, str);

        });
    });

    it('should correctly mock using callbacks', function() {
        var filter = function(str) { return 0 === str.indexOf('blub'); };
        smock.mock(filter, 42);
        smock.unmock( filter );

        ['blub', 'blub1', 'blub2', 'blubblah'].forEach(function(str) {
            var fn = require.bind(this, str);
            expect( fn ).to.throw();
        });
    });
});