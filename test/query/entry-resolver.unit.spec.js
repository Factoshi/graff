const { entryBlockResolvers } = require('../../src/resolvers/query/EntryBlock');
const { FactomdDataLoader } = require('../../src/data_loader');
const { cli } = require('../../src/factom');
const { assert } = require('chai');

describe('EntryBlock Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get the previous EntryBlock', async () => {
        const hash = '5cdc8d974ff8ffa438b1803a8c19342f117bf72bfec107187fdd777ebd327a17';
        const previousBlock = await entryBlockResolvers.previousBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(previousBlock, {
            hash: '82a609d7df91501b5669d1a9df34a6a3b7077aff8ee4308d4d00e03749e5a106',
            chain: '9d8ae4cff16ebe2eeec8f2f73a2dab4ab6950521e5c3f26cfe5dd9bb80b7268d',
            height: 0,
            timestamp: 1560681180
        });
    });
});
