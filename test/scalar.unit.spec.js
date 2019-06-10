const { assert } = require('chai')
const {
    sha256Test,
    createStringTest,
    publicFactoidAddressTest,
    publicEntryCreditAddressTest
} = require('../src/resolvers/scalar')

describe('Test Scalars', () => {
    it('should create a function to test strings', () => {
        const randString = Math.random().toString();
        const stringTest = createStringTest(
            (str) => typeof str === 'string',
            new Error('str is not a string')
        );
        const res = stringTest(randString);
        assert.strictEqual(res, randString);
    });

    it('should test a valid sha256 hash', () => {
        const hash = 'c8e39e953fbc18c6aee20194edbc241961d15941fffa3023045d63cd90dd89a1';
        const sha256 = sha256Test(hash);
        assert.strictEqual(hash, sha256);
    });

    it('should throw on invalid sha256 hash', () => {
        const invalidHash = 'this is not a sha256';
        assert.throws(
            () => sha256Test(invalidHash),
            'Hash cannot represent an invalid SHA256 string.'
        );
    });

    it('should test a valid public FCT address', () => {
        const address = 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv';
        const validAddress = publicFactoidAddressTest(address);
        assert.strictEqual(address, validAddress);
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
        assert.strictEqual(address, validAddress);
    });

    it('should throw on invalid public EC address', () => {
        const invalidAddress = 'EC1zANmWuEMYoH6VizJg6uFaEdi8Excn1VbLN99KRuxh3GSvB7YQ1';
        assert.throws(
            () => publicEntryCreditAddressTest(invalidAddress),
            'PublicEntryCreditAddress must be a valid public entry credit address.'
        );
    });
});
