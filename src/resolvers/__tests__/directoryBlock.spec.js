const { assert } = require('chai');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const {
    directoryBlockRootQueries,
    directoryBlockResolvers
} = require('../directoryBlock');

describe('DirectoryBlock Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get the leaves of DirectoryBlock from the directoryBlock resolver', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const directoryBlock = await directoryBlockRootQueries.directoryBlock(
            undefined,
            { arg: hash },
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, {
            hash,
            height: 196398,
            timestamp: 1560187680
        });
    });

    it('Should get the leaves of DirectoryBlock from the directoryBlock resolver', async () => {
        const height = 196398;
        const directoryBlock = await directoryBlockRootQueries.directoryBlock(
            undefined,
            { arg: height },
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, {
            hash: '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5',
            height,
            timestamp: 1560187680
        });
    });

    it('Should get the leaves of DirectoryBlock from the directoryBlockHead resolver', async () => {
        const directoryBlock = await directoryBlockRootQueries.directoryBlockHead(
            undefined,
            undefined,
            { factomd }
        );
        assert.hasAllKeys(directoryBlock, ['height', 'hash', 'timestamp']);
        assert.isNumber(directoryBlock.height);
        assert.isString(directoryBlock.hash);
        assert.isNumber(directoryBlock.timestamp);
    });

    it('Should resolve the leaves of the adminBlock field', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const adminBlock = await directoryBlockResolvers.adminBlock({ hash }, undefined, {
            factomd
        });
        assert.deepStrictEqual(adminBlock, {
            hash: 'fa772619f08d50175a3a4d261d96a753e760df0cb94e23bcc7a71f80f07bd91a',
            height: 196398
        });
    });

    it('Should resolve the leaves of the entryCreditBlock field', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const adminBlock = await directoryBlockResolvers.entryCreditBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(adminBlock, {
            hash: '9bf8ee63aeb634949e27c20097e29179e37f07f8ff8ce5ddb194d7198fa443d4',
            height: 196398
        });
    });

    it('Should resolve the leaves of the factoidBlock field', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const adminBlock = await directoryBlockResolvers.factoidBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(adminBlock, {
            hash: '4ae637502a17d76cb54857eea2df46d8d2b3d7da4ecc7dcddb139dcc2534003e',
            height: 196398
        });
    });

    it('should resolve the leaves of the nextBlock field', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const adminBlock = await directoryBlockResolvers.nextBlock({ hash }, undefined, {
            factomd
        });
        assert.deepStrictEqual(adminBlock, {
            hash: 'ce9f38482ef869d3bfdb8c87418c04b4d709bb4a8054c8859b1098d48ecbca2e',
            height: 196399,
            timestamp: 1560188280
        });
    });

    it('should resolve the leaves of the previousBlock field', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const adminBlock = await directoryBlockResolvers.previousBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(adminBlock, {
            hash: 'ccd969f2617d0a08853a4a0d9ad4635e220b27a56dbd7aea8d0282b7128a9bde',
            height: 196397,
            timestamp: 1560187080
        });
    });
});
