const { assert } = require('chai');
const { AdminBlock } = require('../../src/resolvers/query/AdminBlock');
const { FactomdDataLoader } = require('../../src/data_loader');
const { cli } = require('../../src/factom');

describe('AdminBlock Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('should resolve the leaves of the previousBlock field', async () => {
        const hash = 'a1f965e4359f23371f27e6b1073ec1a84b7dc076a61c7375f21262efbe558011';
        const previousBlock = await AdminBlock.previousBlock({ hash }, undefined, {
            factomd
        });
        assert.deepStrictEqual(previousBlock, {
            hash: 'fa8e79957c47406d2a55c2c1321ae6a22403d8998b193dea445fca7d732e2cd8',
            height: 189104
        });
    });
});
