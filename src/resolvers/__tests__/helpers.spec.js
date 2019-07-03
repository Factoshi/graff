const { assert } = require('chai');
const {
    handleBlockError,
    handleEntryError,
    testPaginationInput
} = require('../resolver-helpers');

describe('Resolver Helpers', () => {
    it('Should return null on a missing block', () => {
        const missingBlockErr = new Error('foo string Block not found (code: -32008)');
        const shouldBeNull = handleBlockError(missingBlockErr);
        assert.isNull(shouldBeNull);
    });

    it('Should throw on error other than missing block', () => {
        const message = 'omg something really bad happened!';
        const otherBlockError = new Error(message);
        assert.throws(() => handleBlockError(otherBlockError), message);
    });

    it('Should return null on a missing entry', () => {
        const missingBlockErr = new Error(
            'foo string Receipt creation error (code: -32010)'
        );
        const shouldBeNull = handleEntryError(missingBlockErr);
        assert.isNull(shouldBeNull);
    });

    it('Should throw on error other than missing block', () => {
        const message = 'omg something really bad happened!';
        const otherBlockError = new Error(message);
        assert.throws(() => handleEntryError(otherBlockError), message);
    });

    it('Should throw if `offset` is negative', () => {
        assert.throws(
            () => testPaginationInput(-5, 0),
            '`offset` must be a positive integer.'
        );
    });

    it('Should throw if `offset` is not an int', () => {
        assert.throws(
            () => testPaginationInput(5.5, 0),
            '`offset` must be a positive integer.'
        );
    });

    it('Should throw if `first` is negative', () => {
        assert.throws(
            () => testPaginationInput(10, -5),
            '`first` must be a positive integer.'
        );
    });

    it('Should throw if `first` is not an int', () => {
        assert.throws(
            () => testPaginationInput(10, 5.5),
            '`first` must be a positive integer.'
        );
    });
});
