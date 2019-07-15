const {
    handleBlockError,
    handleEntryError,
    testPaginationInput
} = require('../resolver-helpers');

describe('Resolver Helpers', () => {
    it('Should return null on a missing block', () => {
        const missingBlockErr = new Error('foo string Block not found (code: -32008)');
        const shouldBeNull = handleBlockError(missingBlockErr);
        expect(shouldBeNull).toBeNull();
    });

    it('Should throw on error other than missing block', () => {
        const message = 'omg something really bad happened!';
        const otherBlockError = new Error(message);
        expect(() => handleBlockError(otherBlockError)).toThrowError(message);
    });

    it('Should return null on a missing entry', () => {
        const missingBlockErr = new Error(
            'foo string Receipt creation error (code: -32010)'
        );
        const shouldBeNull = handleEntryError(missingBlockErr);
        expect(shouldBeNull).toBeNull();
    });

    it('Should throw on error other than missing block', () => {
        const message = 'omg something really bad happened!';
        const otherBlockError = new Error(message);
        expect(() => handleEntryError(otherBlockError)).toThrowError(message);
    });

    it('Should throw if `offset` is negative', () => {
        expect(() => testPaginationInput(-5, 0)).toThrowError(
            'offset must be a positive integer.'
        );
    });

    it('Should throw if `offset` is not an int', () => {
        expect(() => testPaginationInput(5.5, 0)).toThrowError(
            'offset must be a positive integer.'
        );
    });

    it('Should throw if `first` is negative', () => {
        expect(() => testPaginationInput(10, -5)).toThrowError(
            'first must be a positive integer.'
        );
    });

    it('Should throw if `first` is not an int', () => {
        expect(() => testPaginationInput(10, 5.5)).toThrowError(
            'first must be a positive integer.'
        );
    });
});
