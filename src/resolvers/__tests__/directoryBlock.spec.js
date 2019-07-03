const { assert } = require('chai');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { directoryBlockQueries, directoryBlockResolvers } = require('../DirectoryBlock');

describe.only('DirectoryBlock Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get the hash from the directoryBlock query', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const directoryBlock = await directoryBlockQueries.directoryBlock(
            undefined,
            { hash },
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, { hash });
    });

    it('Should get the hash from the directoryBlockByHeight query', async () => {
        const height = 196398;
        const directoryBlock = await directoryBlockQueries.directoryBlockByHeight(
            undefined,
            { height },
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, {
            hash: '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5'
        });
    });

    it('Should get the hash from the directoryBlockHead query', async () => {
        const directoryBlock = await directoryBlockQueries.directoryBlockHead(
            undefined,
            undefined,
            { factomd }
        );
        assert.hasAllKeys(directoryBlock, ['hash']);
        assert.isString(directoryBlock.hash);
    });

    it('Should resolve the AdminBlock hash.', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const adminBlock = await directoryBlockResolvers.adminBlock({ hash }, undefined, {
            factomd
        });
        assert.deepStrictEqual(adminBlock, {
            hash: 'fa772619f08d50175a3a4d261d96a753e760df0cb94e23bcc7a71f80f07bd91a'
        });
    });

    it('Should resolve the entryCreditBlock hash', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const adminBlock = await directoryBlockResolvers.entryCreditBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(adminBlock, {
            hash: '9bf8ee63aeb634949e27c20097e29179e37f07f8ff8ce5ddb194d7198fa443d4'
        });
    });

    it('Should resolve the factoidBlock hash', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const adminBlock = await directoryBlockResolvers.factoidBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(adminBlock, {
            hash: '4ae637502a17d76cb54857eea2df46d8d2b3d7da4ecc7dcddb139dcc2534003e'
        });
    });

    it('Should resolve the height', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const height = await directoryBlockResolvers.height({ hash }, undefined, {
            factomd
        });
        assert.strictEqual(height, 196398);
    });

    it('should resolve the nextBlock hash', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const adminBlock = await directoryBlockResolvers.nextBlock({ hash }, undefined, {
            factomd
        });
        assert.deepStrictEqual(adminBlock, {
            hash: 'ce9f38482ef869d3bfdb8c87418c04b4d709bb4a8054c8859b1098d48ecbca2e'
        });
    });

    it('Should resolve the timestamp', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const timestamp = await directoryBlockResolvers.timestamp({ hash }, undefined, {
            factomd
        });
        assert.strictEqual(timestamp, 1560187680000);
    });

    it('should resolve the previousBlock hash', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const adminBlock = await directoryBlockResolvers.previousBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(adminBlock, {
            hash: 'ccd969f2617d0a08853a4a0d9ad4635e220b27a56dbd7aea8d0282b7128a9bde'
        });
    });

    it('should get all the entry blocks in a directory block', async () => {
        const hash = '902b88e980c2579983365f1999afe7f8de06aa9ec79627fbe7fed0a63139020e';
        const allEntryBlocks = await directoryBlockResolvers.entryBlocks(
            { hash },
            {},
            { factomd }
        );
        assert.hasAllKeys(allEntryBlocks, [
            'totalCount',
            'entryBlocks',
            'offset',
            'pageLength'
        ]);
        assert.strictEqual(allEntryBlocks.totalCount, 93);
        assert.lengthOf(allEntryBlocks.entryBlocks, 93);
        assert.strictEqual(allEntryBlocks.offset, 0);
        assert.strictEqual(allEntryBlocks.pageLength, 93);
        allEntryBlocks.entryBlocks.forEach(entryBlock =>
            assert.hasAllKeys(entryBlock, ['hash', 'chain'])
        );
    });

    it('should get the first 20 paginated entry blocks in a directory block', async () => {
        const hash = '902b88e980c2579983365f1999afe7f8de06aa9ec79627fbe7fed0a63139020e';
        const first20 = await directoryBlockResolvers.entryBlocks(
            { hash },
            { first: 20, offset: 0 },
            { factomd }
        );
        assert.strictEqual(first20.totalCount, 93);
        assert.lengthOf(first20.entryBlocks, 20);
        assert.strictEqual(first20.offset, 0);
        assert.strictEqual(first20.pageLength, 20);
        assert.strictEqual(
            first20.entryBlocks[0].hash,
            'b8876427e9ab4128afcd6351edee0f8a55f565a9b3d6fedee57aad843c8aee77'
        );
        assert.strictEqual(
            first20.entryBlocks[19].hash,
            'ecb250d31a1b50580c95af526accbe8e28c0b576ff1a52cb1f72283fc4df3d0f'
        );
    });

    it('should get the first 20 paginated entry blocks in a directory block', async () => {
        const hash = '902b88e980c2579983365f1999afe7f8de06aa9ec79627fbe7fed0a63139020e';
        const last20 = await directoryBlockResolvers.entryBlocks(
            { hash },
            { first: 20, offset: 73 },
            { factomd }
        );
        assert.strictEqual(last20.totalCount, 93);
        assert.lengthOf(last20.entryBlocks, 20);
        assert.strictEqual(last20.offset, 73);
        assert.strictEqual(last20.pageLength, 20);
        assert.strictEqual(
            last20.entryBlocks[0].hash,
            '7898a30a133ad4d0c5333c7930233ae7859785fc35537d3a3cad8d7af3a743c2'
        );
        assert.strictEqual(
            last20.entryBlocks[19].hash,
            '2e2dc8f24e1c28d3d67a2cf10710a4ba0f28350b5753c64884eb202558b4e1d5'
        );
    });

    it('should get the last page of entry blocks in a directory block with bad `first` input', async () => {
        const hash = '902b88e980c2579983365f1999afe7f8de06aa9ec79627fbe7fed0a63139020e';
        const entryBlocks = await directoryBlockResolvers.entryBlocks(
            { hash },
            // This goes over the total number of entries available in the block.
            { first: 30, offset: 70 },
            { factomd }
        );
        assert.strictEqual(entryBlocks.totalCount, 93);
        assert.lengthOf(entryBlocks.entryBlocks, 23);
        assert.strictEqual(entryBlocks.offset, 70);
        assert.strictEqual(entryBlocks.pageLength, 23);
        assert.strictEqual(
            entryBlocks.entryBlocks[0].hash,
            'bc17f8b8034a7687a3add2817759501cbd286011c6229e3a537f220cbf5a57be'
        );
        assert.strictEqual(
            entryBlocks.entryBlocks[22].hash,
            '2e2dc8f24e1c28d3d67a2cf10710a4ba0f28350b5753c64884eb202558b4e1d5'
        );
    });
});
