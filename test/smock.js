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