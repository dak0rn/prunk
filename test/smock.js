/**
 * Tests for smock
 *
 */
var expect = require('chai').expect;
var smock = require('..');

// Export
describe('Export', function() {

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