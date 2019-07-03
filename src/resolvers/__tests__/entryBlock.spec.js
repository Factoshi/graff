const { entryBlockResolvers, entryBlockQueries } = require('../EntryBlock');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { assert } = require('chai');
const { randomBytes } = require('crypto');

describe('EntryBlock Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should resolve an entry block hash from the chainHead query', async () => {
        const chain = 'b47b83b04ba3b09305e7e02618c457c3fd82531a4ab81b16e73d780dfc2f3b18';
        const chainHead = await entryBlockQueries.chainHead(
            undefined,
            { chain },
            { factomd }
        );
        assert.hasAllKeys(chainHead, ['hash']);
        assert.isString(chainHead.hash);
    });

    it('Should return null for a chain that doeas not exist', async () => {
        const chainHead = await entryBlockQueries.chainHead(
            undefined,
            { chain: randomBytes(32).toString('hex') },
            { factomd }
        );
        assert.isNull(chainHead);
    });

    it('Should resolve an entry block hash from the entryBlock query', async () => {
        const hash = '4dd4d88ab67c272817f78672768f5bac546743546c7755949f9c20a4583a0c9c';
        const entryBlock = await entryBlockQueries.entryBlock(
            undefined,
            { hash },
            { factomd }
        );
        assert.strictEqual(entryBlock.hash, hash);
    });

    it('Should return null for an entry block that doeas not exist', async () => {
        const entryBlock = await entryBlockQueries.entryBlock(
            undefined,
            { hash: randomBytes(32).toString('hex') },
            { factomd }
        );
        assert.isNull(entryBlock);
    });

    it('Should get the previous EntryBlock', async () => {
        const hash = '5cdc8d974ff8ffa438b1803a8c19342f117bf72bfec107187fdd777ebd327a17';
        const previousBlock = await entryBlockResolvers.previousBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(previousBlock, {
            hash: '82a609d7df91501b5669d1a9df34a6a3b7077aff8ee4308d4d00e03749e5a106'
        });
    });

    it('Should return null if the previous EntryBlock does not exist', async () => {
        const hash = 'c9a31274b89004c9a91c94ad1224b8e1ff59b08a32b3eef16cf7081692988b24';
        const previousBlock = await entryBlockResolvers.previousBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.isNull(previousBlock);
    });

    it('should get all the entries in an entry block', async () => {
        const hash = 'fc056babef747ad84cce087c2bd446f0e93e0e848eff069dce08f623e4b3434f';
        const allEntries = await entryBlockResolvers.entries({ hash }, {}, { factomd });
        assert.hasAllKeys(allEntries, ['totalCount', 'entries', 'offset', 'pageLength']);
        assert.strictEqual(allEntries.totalCount, 41);
        assert.lengthOf(allEntries.entries, 41);
        assert.strictEqual(allEntries.offset, 0);
        assert.strictEqual(allEntries.pageLength, 41);
        allEntries.entries.forEach(entry => {
            assert.hasAllKeys(entry, ['hash', 'chain', 'timestamp', 'entryBlock']);
            assert.hasAllKeys(entry.entryBlock, ['hash', 'chain', 'timestamp', 'height']);
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
        assert.hasAllKeys(first20, ['totalCount', 'entries', 'offset', 'pageLength']);
        assert.strictEqual(first20.totalCount, 41);
        assert.lengthOf(first20.entries, 20);
        assert.strictEqual(first20.offset, 0);
        assert.strictEqual(first20.pageLength, 20);
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
        assert.hasAllKeys(last20, ['totalCount', 'entries', 'offset', 'pageLength']);
        assert.strictEqual(last20.totalCount, 41);
        assert.lengthOf(last20.entries, 20);
        assert.strictEqual(last20.offset, 21);
        assert.strictEqual(last20.pageLength, 20);
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
        assert.hasAllKeys(entries, ['totalCount', 'entries', 'offset', 'pageLength']);
        assert.strictEqual(entries.totalCount, 41);
        assert.lengthOf(entries.entries, 11);
        assert.strictEqual(entries.offset, 30);
        assert.strictEqual(entries.pageLength, 11);
        assert.strictEqual(
            entries.entries[0].hash,
            '03fdffe3955ec618f6361cc8803fb3aa33abddf7e5499576e3f68be807547e07'
        );
        assert.strictEqual(
            entries.entries[10].hash,
            '50bf062c924426c704293a4601cf5e4f2c62ca0b62f3f3abb75010ea4897d447'
        );
    });

    it('Should get the directory block hash', async () => {
        const hash = '7a0f1b6ebb43bab079640e7ff192571b38b2b30cdfc7e50e9acfe1641499c2dc';
        const directoryBlock = await entryBlockResolvers.directoryBlock(
            { hash },
            {},
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, {
            hash: '20009134067fdac455c30b12548ab74bc4ffb6917d4936b73a55a42e66092111'
        });
    });
});
