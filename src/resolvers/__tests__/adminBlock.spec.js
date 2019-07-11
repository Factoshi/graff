const { adminBlockResolvers, adminBlockQueries } = require('../AdminBlock');
const { adminEntryResolvers } = require('../AdminEntry');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { AdminCode } = require('../../types/resolvers');
const { randomBytes } = require('crypto');

describe('AdminBlock Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should resolve the backReferenceHash field from the adminBlock query.', async () => {
        const hash = 'f7198774997518d9c8fed1925e8a4e19277d721ff0dbe21dc40242ef6e9a96b2';
        const adminBlock = await adminBlockQueries.adminBlock({}, { hash }, { factomd });
        expect(adminBlock).toEqual({ backReferenceHash: hash });
    });

    it('Should return null if an AdminBlock cannot be found.', async () => {
        const adminBlock = await adminBlockQueries.adminBlock(
            undefined,
            { hash: randomBytes(32).toString('hex') },
            { factomd }
        );
        expect(adminBlock).toBeNull();
    });

    it('Should resolve the backReferenceHash field from the adminBlockByHeight query.', async () => {
        const backReferenceHash =
            'f7198774997518d9c8fed1925e8a4e19277d721ff0dbe21dc40242ef6e9a96b2';
        const adminBlock = await adminBlockQueries.adminBlockByHeight(
            undefined,
            { height: 10 },
            { factomd }
        );
        expect(adminBlock).toEqual({ backReferenceHash });
    });

    it('Should return null if an AdminBlockByHeight cannot be found.', async () => {
        const adminBlock = await adminBlockQueries.adminBlockByHeight(
            undefined,
            { height: Number.MAX_SAFE_INTEGER },
            { factomd }
        );
        expect(adminBlock).toBeNull();
    });

    it('Should resolve the backReferenceHash field of the adminBlockHead', async () => {
        const directoryBlockHead = await cli.getDirectoryBlockHead();
        const adminBlockHead = await cli.getAdminBlock(directoryBlockHead.adminBlockRef);
        const adminBlock = await adminBlockQueries.adminBlockHead(undefined, undefined, {
            factomd
        });
        expect(adminBlock).toEqual({
            backReferenceHash: adminBlockHead.backReferenceHash
        });
    });

    it('Should resolve the backReferenceHash field of the previousBlock field', async () => {
        const backReferenceHash =
            'f7198774997518d9c8fed1925e8a4e19277d721ff0dbe21dc40242ef6e9a96b2';
        const previousBlock = await adminBlockResolvers.previousBlock(
            { backReferenceHash },
            undefined,
            { factomd }
        );
        expect(previousBlock).toEqual({
            backReferenceHash:
                '3975db81e58939290e9399d319d8e946b8bf6d26ab9e7506a176035dc8dd02ff'
        });
    });

    it('Should resolve the backReferenceHash field of the nextBlock field', async () => {
        const backReferenceHash =
            'f7198774997518d9c8fed1925e8a4e19277d721ff0dbe21dc40242ef6e9a96b2';
        const nextBlock = await adminBlockResolvers.nextBlock(
            { backReferenceHash },
            undefined,
            { factomd }
        );
        expect(nextBlock).toEqual({
            backReferenceHash:
                '2079482b4fe8449939bc2a3d352d4f59d3df3726d486d4206f6dfede61e20236'
        });
    });

    it('Should resolve the leaves of the entries field', async () => {
        // A block with a few different types of admin entry.
        const backReferenceHash =
            'fd92d8174a0e53eebae95af6ebe1a1bc8abe1f5acdc4c1cab4d1425ceb205767';
        const entries = await adminBlockResolvers.entries(
            { backReferenceHash },
            undefined,
            { factomd }
        );
        expect(entries).toBeInstanceOf(Array);
        expect(entries).toHaveLength(32);
        entries.forEach(entry => {
            expect(Object.values(AdminCode).includes(entry.code)).toBe(true);
            expect(entry.id).toBeGreaterThanOrEqual(1);
            expect(entry.id).toBeLessThanOrEqual(14);
        });
    });

    it('Should resolve the keyMR of the directoryBlock field', async () => {
        const backReferenceHash =
            'f7198774997518d9c8fed1925e8a4e19277d721ff0dbe21dc40242ef6e9a96b2';
        const directoryBlock = await adminBlockResolvers.directoryBlock(
            { backReferenceHash },
            undefined,
            { factomd }
        );
        expect(directoryBlock).toEqual({
            keyMR: '3a5ec711a1dc1c6e463b0c0344560f830eb0b56e42def141cb423b0d8487a1dc'
        });
    });

    it('Should resolve the lookup hash of the admin block', async () => {
        const backReferenceHash =
            'f7198774997518d9c8fed1925e8a4e19277d721ff0dbe21dc40242ef6e9a96b2';
        const lookupHash = await adminBlockResolvers.lookupHash(
            { backReferenceHash },
            undefined,
            { factomd }
        );
        expect(lookupHash).toBe(
            '60d6c075925bbd2ddaf3b8c6737225d9df1963d0d098e10b67605d557857fc52'
        );
    });

    it('Should resolve the bodySize hash of the admin block', async () => {
        const backReferenceHash =
            'f7198774997518d9c8fed1925e8a4e19277d721ff0dbe21dc40242ef6e9a96b2';
        const bodySize = await adminBlockResolvers.bodySize(
            { backReferenceHash },
            undefined,
            { factomd }
        );
        expect(bodySize).toBe(131);
    });
});

describe('AdminEntry resolvers', () => {
    it('Should resolve the AdminEntry type', () => {
        const adminEntry = { id: 1, code: AdminCode.DirectoryBlockSignature };
        const resolvedType = adminEntryResolvers.__resolveType(adminEntry);
        expect(resolvedType).toBe('DirectoryBlockSignature');
    });
});
