const { InMemoryLRUCache } = require('apollo-server-caching');
const { FactomdDataSource } = require('../../dataSource');
const { factomCli } = require('../../connect');
const { directoryBlockQueries, directoryBlockResolvers } = require('../DirectoryBlock');
const { randomBytes } = require('crypto');

const factomd = new FactomdDataSource(factomCli);
const cache = new InMemoryLRUCache();
factomd.initialize({
    cache,
    context: {}
});
const context = { dataSources: { factomd } };

describe('DirectoryBlock Resolvers', () => {
    afterEach(() => cache.flush());

    it('Should resolve the keyMR from the directoryBlock query', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const directoryBlock = await directoryBlockQueries.directoryBlock(
            undefined,
            { hash },
            context
        );
        expect(directoryBlock).toEqual({ keyMR: hash });
    });

    it('Should return null for a diretoryBlock that does not exist', async () => {
        const directoryBlock = await directoryBlockQueries.directoryBlock(
            undefined,
            { hash: randomBytes(32).toString('hex') },
            context
        );
        expect(directoryBlock).toBeNull();
    });

    it('Should resolve the keyMR from the directoryBlockByHeight query', async () => {
        const height = 196398;
        const directoryBlock = await directoryBlockQueries.directoryBlockByHeight(
            undefined,
            { height },
            context
        );
        expect(directoryBlock).toEqual({
            keyMR: '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5'
        });
    });

    it('Should return null for a directoryBlockByHeight that does not exist', async () => {
        const directoryBlock = await directoryBlockQueries.directoryBlockByHeight(
            undefined,
            { height: Number.MAX_SAFE_INTEGER },
            context
        );
        expect(directoryBlock).toBeNull();
    });

    it('Should get the hash from the directoryBlockHead query', async () => {
        const directoryBlock = await directoryBlockQueries.directoryBlockHead(
            undefined,
            undefined,
            context
        );
        expect(typeof directoryBlock.keyMR).toBe('string');
    });

    it('Should resolve the AdminBlock backReferenceHash.', async () => {
        const keyMR = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const adminBlock = await directoryBlockResolvers.adminBlock(
            { keyMR },
            undefined,
            context
        );
        expect(adminBlock).toEqual({
            backReferenceHash:
                '26d4c8fac77ed2dadec84c8f764cce0a27220d186c191134b729374d1cc7dfbd'
        });
    });

    it('Should resolve the entryCreditBlock headerHash', async () => {
        const keyMR = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const entryCreditBlock = await directoryBlockResolvers.entryCreditBlock(
            { keyMR },
            undefined,
            context
        );
        expect(entryCreditBlock).toEqual({
            headerHash: '9bf8ee63aeb634949e27c20097e29179e37f07f8ff8ce5ddb194d7198fa443d4'
        });
    });

    it('Should resolve the factoidBlock keyMR', async () => {
        const keyMR = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const factoidBlock = await directoryBlockResolvers.factoidBlock(
            { keyMR },
            undefined,
            context
        );
        expect(factoidBlock).toEqual({
            keyMR: '4ae637502a17d76cb54857eea2df46d8d2b3d7da4ecc7dcddb139dcc2534003e'
        });
    });

    it('Should resolve the height', async () => {
        const keyMR = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const height = await directoryBlockResolvers.height(
            { keyMR },
            undefined,
            context
        );
        expect(height).toBe(196398);
    });

    it('should resolve the nextBlock keyMR', async () => {
        const keyMR = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const directoryBlock = await directoryBlockResolvers.nextBlock(
            { keyMR },
            undefined,
            context
        );
        expect(directoryBlock).toEqual({
            keyMR: 'ce9f38482ef869d3bfdb8c87418c04b4d709bb4a8054c8859b1098d48ecbca2e'
        });
    });

    it('Should resolve the timestamp', async () => {
        const keyMR = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const timestamp = await directoryBlockResolvers.timestamp(
            { keyMR },
            undefined,
            context
        );
        expect(timestamp).toBe(1560187680);
    });

    it('should resolve the previousBlock keyMR', async () => {
        const keyMR = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const directoryBlock = await directoryBlockResolvers.previousBlock(
            { keyMR },
            undefined,
            context
        );
        expect(directoryBlock).toEqual({
            keyMR: 'ccd969f2617d0a08853a4a0d9ad4635e220b27a56dbd7aea8d0282b7128a9bde'
        });
    });

    it('should get all the entry blocks in a directory block', async () => {
        const keyMR = '902b88e980c2579983365f1999afe7f8de06aa9ec79627fbe7fed0a63139020e';
        const allEntryBlocks = await directoryBlockResolvers.entryBlockPage(
            { keyMR },
            {},
            context
        );
        expect(allEntryBlocks.totalCount).toBe(93);
        expect(allEntryBlocks.entryBlocks).toHaveLength(93);
        expect(allEntryBlocks.offset).toBe(0);
        expect(allEntryBlocks.pageLength).toBe(93);
        allEntryBlocks.entryBlocks.forEach(entryBlock => {
            expect(typeof entryBlock.keyMR).toBe('string');
            expect(typeof entryBlock.chainId).toBe('string');
        });
    });

    it('should get the first 20 paginated entry blocks in a directory block', async () => {
        const keyMR = '902b88e980c2579983365f1999afe7f8de06aa9ec79627fbe7fed0a63139020e';
        const first20 = await directoryBlockResolvers.entryBlockPage(
            { keyMR },
            { first: 20, offset: 0 },
            context
        );
        expect(first20.totalCount).toBe(93);
        expect(first20.entryBlocks).toHaveLength(20);
        expect(first20.offset).toBe(0);
        expect(first20.pageLength).toBe(20);
        expect(first20.entryBlocks[0].keyMR).toBe(
            'b8876427e9ab4128afcd6351edee0f8a55f565a9b3d6fedee57aad843c8aee77'
        );
        expect(first20.entryBlocks[19].keyMR).toBe(
            'ecb250d31a1b50580c95af526accbe8e28c0b576ff1a52cb1f72283fc4df3d0f'
        );
    });

    it('should get the first 20 paginated entry blocks in a directory block', async () => {
        const keyMR = '902b88e980c2579983365f1999afe7f8de06aa9ec79627fbe7fed0a63139020e';
        const last20 = await directoryBlockResolvers.entryBlockPage(
            { keyMR },
            { first: 20, offset: 73 },
            context
        );
        expect(last20.totalCount).toBe(93);
        expect(last20.entryBlocks).toHaveLength(20);
        expect(last20.offset).toBe(73);
        expect(last20.pageLength).toBe(20);
        expect(last20.entryBlocks[0].keyMR).toBe(
            '7898a30a133ad4d0c5333c7930233ae7859785fc35537d3a3cad8d7af3a743c2'
        );
        expect(last20.entryBlocks[19].keyMR).toBe(
            '2e2dc8f24e1c28d3d67a2cf10710a4ba0f28350b5753c64884eb202558b4e1d5'
        );
    });

    it('should get the last page of entry blocks in a directory block with bad `first` input', async () => {
        const keyMR = '902b88e980c2579983365f1999afe7f8de06aa9ec79627fbe7fed0a63139020e';
        const entryBlocks = await directoryBlockResolvers.entryBlockPage(
            { keyMR },
            // This goes over the total number of entries available in the block.
            { first: 30, offset: 70 },
            context
        );
        expect(entryBlocks.totalCount).toBe(93);
        expect(entryBlocks.entryBlocks).toHaveLength(23);
        expect(entryBlocks.offset).toBe(70);
        expect(entryBlocks.pageLength).toBe(23);
        expect(entryBlocks.entryBlocks[0].keyMR).toBe(
            'bc17f8b8034a7687a3add2817759501cbd286011c6229e3a537f220cbf5a57be'
        );
        expect(entryBlocks.entryBlocks[22].keyMR).toBe(
            '2e2dc8f24e1c28d3d67a2cf10710a4ba0f28350b5753c64884eb202558b4e1d5'
        );
    });
});
