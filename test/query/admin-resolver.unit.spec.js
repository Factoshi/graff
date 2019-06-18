const { assert } = require('chai');
const { adminBlockResolvers } = require('../../src/resolvers/query/AdminBlock');
const { adminEntryResolvers } = require('../../src/resolvers/query/AdminEntry');
const { FactomdDataLoader } = require('../../src/data_loader');
const { cli } = require('../../src/factom');
const { AdminCode } = require('../../src/types/resolvers');

describe('AdminBlock Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

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

    it('Should resolve the leaves of the directoryBlock field', async () => {
        const hash = 'a1f965e4359f23371f27e6b1073ec1a84b7dc076a61c7375f21262efbe558011';
        const directoryBlock = await adminBlockResolvers.directoryBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, { height: 189105 });
    });
});

describe('AdminEntry resolvers', () => {
    it('Should resolve the AdminEntry type', () => {
        const adminEntry = { id: 1, code: AdminCode.DirectoryBlockSignature };
        const resolvedType = adminEntryResolvers.__resolveType(adminEntry);
        assert.strictEqual(resolvedType, 'DirectoryBlockSignature');
    });
});
