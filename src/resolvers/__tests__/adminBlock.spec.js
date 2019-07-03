const { assert } = require('chai');
const { adminBlockResolvers, adminBlockRootQueries } = require('../AdminBlock');
const { adminEntryResolvers } = require('../AdminEntry');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { AdminCode } = require('../../types/resolvers');

describe('AdminBlock Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get the leaves of AdminBlock from the adminBlock resolver using a hash.', async () => {
        const hash = 'f7198774997518d9c8fed1925e8a4e19277d721ff0dbe21dc40242ef6e9a96b2';
        const height = 10;
        const adminBlock = await adminBlockRootQueries.adminBlock(
            {},
            { arg: hash },
            { factomd }
        );
        assert.deepStrictEqual(adminBlock, { hash, height });
    });

    it('Should get the leaves of AdminBlock from the adminBlock resolver using a height.', async () => {
        const hash = 'f7198774997518d9c8fed1925e8a4e19277d721ff0dbe21dc40242ef6e9a96b2';
        const height = 10;
        const adminBlock = await adminBlockRootQueries.adminBlock(
            undefined,
            { arg: height },
            { factomd }
        );
        assert.deepStrictEqual(adminBlock, { hash, height });
    });

    it('Should return null if an AdminBlock cannot be found.', async () => {
        const adminBlock = await adminBlockRootQueries.adminBlock(
            undefined,
            { arg: Number.MAX_SAFE_INTEGER },
            { factomd }
        );
        assert.isNull(adminBlock);
    });

    it('Should get the leaves of AdminBlock from the adminBlockHead resolver', async () => {
        const adminBlock = await adminBlockRootQueries.adminBlockHead(
            undefined,
            undefined,
            { factomd }
        );
        assert.hasAllKeys(adminBlock, ['hash', 'height']);
        assert.isString(adminBlock.hash);
        assert.isNumber(adminBlock.height);
    });

    it('Should resolve the leaves of the previousBlock field', async () => {
        const hash = 'a1f965e4359f23371f27e6b1073ec1a84b7dc076a61c7375f21262efbe558011';
        const previousBlock = await adminBlockResolvers.previousBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(previousBlock, {
            hash: 'fa8e79957c47406d2a55c2c1321ae6a22403d8998b193dea445fca7d732e2cd8',
            height: 189104
        });
    });

    it('Should resolve the leaves of the nextBlock field', async () => {
        const hash = 'a1f965e4359f23371f27e6b1073ec1a84b7dc076a61c7375f21262efbe558011';
        const nextBlock = await adminBlockResolvers.nextBlock({ hash }, undefined, {
            factomd
        });
        assert.deepStrictEqual(nextBlock, {
            hash: '5f285984f186293eca7fc7944b864d16afb75c4438f755689ae1c52306b7f9ef',
            height: 189106
        });
    });

    it('Should resolve the leaves of the entries field', async () => {
        // A block with a few different types of admin entry.
        const hash = 'fd92d8174a0e53eebae95af6ebe1a1bc8abe1f5acdc4c1cab4d1425ceb205767';
        const entries = await adminBlockResolvers.entries({ hash }, undefined, {
            factomd
        });
        assert.isArray(entries);
        assert.lengthOf(entries, 32);
        entries.forEach(entry => {
            assert(
                Object.values(AdminCode).includes(entry.code),
                `code "${entry.code}" does not exist on the AdminCode enum`
            );
            assert.isNumber(entry.id);
            assert(entry.id >= 1 && entry.id <= 14), 'ID is out of bounds';
        });
    });

    it('Should resolve the hash of the directoryBlock field', async () => {
        const hash = 'a1f965e4359f23371f27e6b1073ec1a84b7dc076a61c7375f21262efbe558011';
        const directoryBlock = await adminBlockResolvers.directoryBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, {
            hash: '40f8138a651cd9a0f6313f5031d5ee6480a9a176262333e4c29e423f98904c1c'
        });
    });

    it('Should resolve the height of the admin block', async () => {
        const hash = '73a65e3b82869831fd78f8a13f78d08ee7477063082c060ff4320a12ce02aed8';
        const height = await adminBlockResolvers.height({ hash }, undefined, {
            factomd
        });
        assert.strictEqual(height, 199653);
    });
});

describe('AdminEntry resolvers', () => {
    it('Should resolve the AdminEntry type', () => {
        const adminEntry = { id: 1, code: AdminCode.DirectoryBlockSignature };
        const resolvedType = adminEntryResolvers.__resolveType(adminEntry);
        assert.strictEqual(resolvedType, 'DirectoryBlockSignature');
    });
});
