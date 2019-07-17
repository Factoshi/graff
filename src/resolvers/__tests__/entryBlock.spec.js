const { InMemoryLRUCache } = require('apollo-server-caching');
const { FactomdDataSource } = require('../../datasource');
const { entryBlockResolvers, entryBlockQueries } = require('../EntryBlock');
const { cli } = require('../../factom');
const { randomBytes } = require('crypto');

const factomd = new FactomdDataSource(cli);
const cache = new InMemoryLRUCache();
factomd.initialize({
    cache,
    context: {}
});
const context = { dataSources: { factomd } };

describe('EntryBlock Resolvers', () => {
    afterEach(() => cache.flush());

    it('Should resolve an entry block keyMR from the chainHead query', async () => {
        const chainId =
            'b47b83b04ba3b09305e7e02618c457c3fd82531a4ab81b16e73d780dfc2f3b18';
        const chainHead = await entryBlockQueries.chainHead(
            undefined,
            { chainId },
            context
        );
        expect(typeof chainHead.keyMR).toBe('string');
    });

    it('Should return null for a chain that doeas not exist', async () => {
        const chainHead = await entryBlockQueries.chainHead(
            undefined,
            { chainId: randomBytes(32).toString('hex') },
            context
        );
        expect(chainHead).toBeNull();
    });

    it('Should resolve an entry block hash from the entryBlock query', async () => {
        const hash = '4dd4d88ab67c272817f78672768f5bac546743546c7755949f9c20a4583a0c9c';
        const entryBlock = await entryBlockQueries.entryBlock(
            undefined,
            { hash },
            context
        );
        expect(entryBlock.keyMR).toBe(hash);
    });

    it('Should return null for an entry block that doeas not exist', async () => {
        const entryBlock = await entryBlockQueries.entryBlock(
            undefined,
            { hash: randomBytes(32).toString('hex') },
            context
        );
        expect(entryBlock).toBe(null);
    });

    it('Should resolve the keyMR of the previous EntryBlock', async () => {
        const keyMR = '5cdc8d974ff8ffa438b1803a8c19342f117bf72bfec107187fdd777ebd327a17';
        const previousBlock = await entryBlockResolvers.previousBlock(
            { keyMR },
            undefined,
            context
        );
        expect(previousBlock).toEqual({
            keyMR: '82a609d7df91501b5669d1a9df34a6a3b7077aff8ee4308d4d00e03749e5a106'
        });
    });

    it('Should return null if the previous EntryBlock does not exist', async () => {
        const keyMR = 'c9a31274b89004c9a91c94ad1224b8e1ff59b08a32b3eef16cf7081692988b24';
        const previousBlock = await entryBlockResolvers.previousBlock(
            { keyMR },
            undefined,
            context
        );
        expect(previousBlock).toBeNull();
    });

    it('should resolve all the entries in an entry block', async () => {
        const keyMR = 'fc056babef747ad84cce087c2bd446f0e93e0e848eff069dce08f623e4b3434f';
        const allEntries = await entryBlockResolvers.entryPage({ keyMR }, {}, context);
        expect(allEntries.entries).toHaveLength(41);
        expect(allEntries.pageLength).toBe(41);
        expect(allEntries.totalCount).toBe(41);
        expect(allEntries.offset).toBe(0);
        allEntries.entries.forEach(entry => {
            expect(typeof entry.hash).toBe('string');
            expect(typeof entry.chainId).toBe('string');
            expect(typeof entry.timestamp).toBe('number');
            expect(entry.entryBlock).not.toBeUndefined();
            expect(typeof entry.entryBlock.keyMR).toBe('string');
        });
    });

    it('should resolve the first 20 paginated entries in an entry block', async () => {
        const keyMR = 'fc056babef747ad84cce087c2bd446f0e93e0e848eff069dce08f623e4b3434f';
        const first20 = await entryBlockResolvers.entryPage(
            { keyMR },
            { offset: 0, first: 20 },
            context
        );
        expect(first20.entries).toHaveLength(20);
        expect(first20.pageLength).toBe(20);
        expect(first20.totalCount).toBe(41);
        expect(first20.offset).toBe(0);
        expect(first20.entries[0].hash).toBe(
            '8a39d74471c6ff2bf8ca38d4670577eec972f5e23335c327f02669d10b9a7e6a'
        );
        expect(first20.entries[19].hash).toBe(
            '1dbc9c5239d2bce09bdfa2d7b28937d9b40b0b6c9d9f74ad051749089b76dd0d'
        );
    });

    it('should resolve the last 20 paginated entries in an entry block', async () => {
        const keyMR = 'fc056babef747ad84cce087c2bd446f0e93e0e848eff069dce08f623e4b3434f';
        const last20 = await entryBlockResolvers.entryPage(
            { keyMR },
            { offset: 21, first: 20 },
            context
        );
        expect(last20.entries).toHaveLength(20);
        expect(last20.pageLength).toBe(20);
        expect(last20.totalCount).toBe(41);
        expect(last20.offset).toBe(21);
        expect(last20.entries[0].hash).toBe(
            '57561ab4ae34920e02629bf58bb59d4f301471ba9fcf0d8a9e24c8ec33b4d99e'
        );
        expect(last20.entries[19].hash).toBe(
            '50bf062c924426c704293a4601cf5e4f2c62ca0b62f3f3abb75010ea4897d447'
        );
    });

    it('should resolve the last page of entries in an entry block with bad `first` input', async () => {
        const keyMR = 'fc056babef747ad84cce087c2bd446f0e93e0e848eff069dce08f623e4b3434f';
        const entryPage = await entryBlockResolvers.entryPage(
            { keyMR },
            // This goes over the total number of entries available in the block.
            { offset: 30, first: 20 },
            context
        );
        expect(entryPage.entries).toHaveLength(11);
        expect(entryPage.pageLength).toBe(11);
        expect(entryPage.totalCount).toBe(41);
        expect(entryPage.offset).toBe(30);
        expect(entryPage.entries[0].hash).toBe(
            '03fdffe3955ec618f6361cc8803fb3aa33abddf7e5499576e3f68be807547e07'
        );
        expect(entryPage.entries[10].hash).toBe(
            '50bf062c924426c704293a4601cf5e4f2c62ca0b62f3f3abb75010ea4897d447'
        );
    });

    it('Should resolve the directory block keyMR', async () => {
        const keyMR = '7a0f1b6ebb43bab079640e7ff192571b38b2b30cdfc7e50e9acfe1641499c2dc';
        const directoryBlock = await entryBlockResolvers.directoryBlock(
            { keyMR },
            {},
            context
        );
        expect(directoryBlock).toEqual({
            keyMR: '20009134067fdac455c30b12548ab74bc4ffb6917d4936b73a55a42e66092111'
        });
    });
});
