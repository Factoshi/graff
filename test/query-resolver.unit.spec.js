const { assert } = require('chai');
const { Query } = require('../src/resolvers/query/Query');

describe('Query Resolvers', () => {
    it('Should return an AdminBlock partial', () => {
        const hash = 'a hash';
        const adminBlock = Query.adminBlock(undefined, 'a hash');
        assert.deepStrictEqual({ hash }, adminBlock);
    });
});
