const { entryBlockResolvers, entryBlockRootQueries } = require('../EntryBlock');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { assert } = require('chai');

describe('EntryBlock Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get the leaves of EntryBlock from the chainHead resolver', async () => {
        const chain = 'b47b83b04ba3b09305e7e02618c457c3fd82531a4ab81b16e73d780dfc2f3b18';
        const chainHead = await entryBlockRootQueries.chainHead(
            undefined,
            { chain },
            { factomd }
        );
        assert.hasAllKeys(chainHead, ['hash', 'chain', 'height', 'timestamp']);
        assert.isString(chainHead.hash);
        assert.isString(chainHead.chain);
        assert.isNumber(chainHead.height);
        assert.isNumber(chainHead.timestamp);
    });

    it('Should get the leaves of EntryBlock from the entryBlock resolver', async () => {
        const hash = '4dd4d88ab67c272817f78672768f5bac546743546c7755949f9c20a4583a0c9c';
        const entryBlock = await entryBlockRootQueries.entryBlock(
            undefined,
            { hash },
            { factomd }
        );
        assert.strictEqual(entryBlock.hash, hash);
        assert.strictEqual(
            entryBlock.chain,
            '4a35522c834022a4153c4ac92f61f22fad640647f91a21a65cf632f738717966'
        );
        assert.strictEqual(entryBlock.height, 1381);
        assert.strictEqual(entryBlock.timestamp, 1560238680000);
    });

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
            timestamp: 1560681180000
        });
    });

    it('should get all the entries in an entry block', async () => {
        const hash = 'fc056babef747ad84cce087c2bd446f0e93e0e848eff069dce08f623e4b3434f';
        const allEntries = await entryBlockResolvers.entries({ hash }, {}, { factomd });
        assert.hasAllKeys(allEntries, [
            'totalCount',
            'entries',
            'offset',
            'pageLength',
            'finalPage'
        ]);
        assert.strictEqual(allEntries.totalCount, 41);
        assert.lengthOf(allEntries.entries, 41);
        assert.strictEqual(allEntries.offset, 0);
        assert.strictEqual(allEntries.pageLength, 41);
        assert.isTrue(allEntries.finalPage);
        allEntries.entries.forEach(entry => {
            assert.hasAllKeys(entry, ['hash', 'chain', 'timestamp', 'block']);
            assert.hasAllKeys(entry.block, ['hash', 'chain', 'timestamp', 'height']);
            assert.isString(entry.hash);
            assert.isString(entry.chain);
            assert.isNumber(entry.timestamp);
        });
    });

    it('should get the first 20 paginated entries in an entry block', async () => {
        const hash = 'fc056babef747ad84cce087c2bd446f0e93e0e848eff069dce08f623e4b3434f';
        const first20 = await entryBlockResolvers.entries(
            { hash },
            { offset: 0, first: 20 },
            { factomd }
        );
        assert.hasAllKeys(first20, [
            'totalCount',
            'entries',
            'offset',
            'pageLength',
            'finalPage'
        ]);
        assert.strictEqual(first20.totalCount, 41);
        assert.lengthOf(first20.entries, 20);
        assert.strictEqual(first20.offset, 0);
        assert.strictEqual(first20.pageLength, 20);
        assert.isFalse(first20.finalPage);
        assert.strictEqual(
            first20.entries[0].hash,
            '8a39d74471c6ff2bf8ca38d4670577eec972f5e23335c327f02669d10b9a7e6a'
        );
        assert.strictEqual(
            first20.entries[19].hash,
            '1dbc9c5239d2bce09bdfa2d7b28937d9b40b0b6c9d9f74ad051749089b76dd0d'
        );
    });

    it('should get the last 20 paginated entries in an entry block', async () => {
        const hash = 'fc056babef747ad84cce087c2bd446f0e93e0e848eff069dce08f623e4b3434f';
        const last20 = await entryBlockResolvers.entries(
            { hash },
            { offset: 21, first: 20 },
            { factomd }
        );
        assert.hasAllKeys(last20, [
            'totalCount',
            'entries',
            'offset',
            'pageLength',
            'finalPage'
        ]);
        assert.strictEqual(last20.totalCount, 41);
        assert.lengthOf(last20.entries, 20);
        assert.strictEqual(last20.offset, 21);
        assert.strictEqual(last20.pageLength, 20);
        assert.isTrue(last20.finalPage);
        assert.strictEqual(
            last20.entries[0].hash,
            '57561ab4ae34920e02629bf58bb59d4f301471ba9fcf0d8a9e24c8ec33b4d99e'
        );
        assert.strictEqual(
            last20.entries[19].hash,
            '50bf062c924426c704293a4601cf5e4f2c62ca0b62f3f3abb75010ea4897d447'
        );
    });

    it('should get the last page of entries in an entry block with bad `first` input', async () => {
        const hash = 'fc056babef747ad84cce087c2bd446f0e93e0e848eff069dce08f623e4b3434f';
        const entries = await entryBlockResolvers.entries(
            { hash },
            // This goes over the total number of entries available in the block.
            { offset: 30, first: 20 },
            { factomd }
        );
        assert.hasAllKeys(entries, [
            'totalCount',
            'entries',
            'offset',
            'pageLength',
            'finalPage'
        ]);
        assert.strictEqual(entries.totalCount, 41);
        assert.lengthOf(entries.entries, 11);
        assert.strictEqual(entries.offset, 30);
        assert.strictEqual(entries.pageLength, 11);
        assert.isTrue(entries.finalPage);
        assert.strictEqual(
            entries.entries[0].hash,
            '03fdffe3955ec618f6361cc8803fb3aa33abddf7e5499576e3f68be807547e07'
        );
        assert.strictEqual(
            entries.entries[10].hash,
            '50bf062c924426c704293a4601cf5e4f2c62ca0b62f3f3abb75010ea4897d447'
        );
    });

    it('Should get the directory block height', async () => {
        const hash = '7a0f1b6ebb43bab079640e7ff192571b38b2b30cdfc7e50e9acfe1641499c2dc';
        const directoryBlock = await entryBlockResolvers.directoryBlock(
            { hash },
            {},
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, { height: 197517 });
    });
});
