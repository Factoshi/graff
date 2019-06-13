const { assert } = require('chai');
const {
    sha256Test,
    publicFactoidAddressTest,
    publicEntryCreditAddressTest,
    heightTest
} = require('../src/resolvers/scalar');

describe('Custom Scalars', () => {
    it('should test a valid sha256 hash', () => {
        const hash = 'c8e39e953fbc18c6aee20194edbc241961d15941fffa3023045d63cd90dd89a1';
        const sha256 = sha256Test(hash);
        assert.strictEqual(sha256, hash);
    });

    it('should throw on invalid sha256 hash', () => {
        const invalidHash = 'this is not a sha256';
        assert.throws(
            () => sha256Test(invalidHash),
            'Hash must be a valid SHA256 hex string.'
        );
    });

    it('should test a valid public FCT address', () => {
        const address = 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv';
        const validAddress = publicFactoidAddressTest(address);
        assert.strictEqual(validAddress, address);
    });

    it('should throw on invalid public factoid address', () => {
        const invalidAddress = 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv1';
        assert.throws(
            () => publicFactoidAddressTest(invalidAddress),
            'PublicFactoidAddress must be a valid public factoid address.'
        );
    });

    it('should test a valid public EC address', () => {
        const address = 'EC1zANmWuEMYoH6VizJg6uFaEdi8Excn1VbLN99KRuxh3GSvB7YQ';
        const validAddress = publicEntryCreditAddressTest(address);
        assert.strictEqual(validAddress, address);
    });

    it('should throw on invalid public EC address', () => {
        const invalidAddress = 'EC1zANmWuEMYoH6VizJg6uFaEdi8Excn1VbLN99KRuxh3GSvB7YQ1';
        assert.throws(
            () => publicEntryCreditAddressTest(invalidAddress),
            'PublicEntryCreditAddress must be a valid public entry credit address.'
        );
    });

    it('should test a valid height', () => {
        const height = 10;
        const validHeight = heightTest(height);
        assert.strictEqual(validHeight, height);
    });

    it('should throw on a negative height', () => {
        const invalidHeight = -10;
        assert.throws(
            () => heightTest(invalidHeight),
            'Height must be a positive integer.'
        );
    });

    it('should throw on a float height', () => {
        const invalidHeight = 10.5;
        assert.throws(
            () => heightTest(invalidHeight),
            'Height must be a positive integer.'
        );
    });
});
