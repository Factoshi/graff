const { assert } = require('chai');
const { Query } = require('../src/resolvers/query/Query');
const { FactomdDataLoader } = require('../src/data_loader');
const { cli } = require('../src/factom');

describe('Query Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get the leaves of AdminBlock from the adminBlock resolver', () => {
        const hash = '60d6c075925bbd2ddaf3b8c6737225d9df1963d0d098e10b67605d557857fc52';
        const adminBlock = Query.adminBlock(undefined, { hash }, { factomd });
        assert.deepStrictEqual({ hash }, adminBlock);
    });

    it('Should get the leaves of AdminBlock from the adminBlockByHeight resolver', async () => {
        const height = 10;
        const hash = '60d6c075925bbd2ddaf3b8c6737225d9df1963d0d098e10b67605d557857fc52';
        const adminBlock = await Query.adminBlockByHeight(
            undefined,
            { height },
            { factomd }
        );
        assert.deepStrictEqual({ hash }, adminBlock);
    });

    it('Should get the leaves of AdminBlock from the adminBlockHead resolver', async () => {
        const adminBlock = await Query.adminBlockHead(undefined, undefined, { factomd });
        assert.hasAllKeys(adminBlock, ['hash']);
        assert.isString(adminBlock.hash);
    });

    it('should get the leaves of EntryBlock from the chainHead resolver', async () => {
        const chain = 'b47b83b04ba3b09305e7e02618c457c3fd82531a4ab81b16e73d780dfc2f3b18';
        const chainHead = await Query.chainHead(undefined, { chain }, { factomd });
        assert.hasAllKeys(chainHead, ['hash', 'chain', 'height']);
        assert.isString(chainHead.hash);
        assert.isString(chainHead.chain);
        assert.isNumber(chainHead.height);
    });

    it('should get the leaves of EntryCommitAck from the commitAck resolver', async () => {
        const hash = '5f3599d372e9dfe9dd7fe5f2a72743496e99209b0a5776c1e34622fcb3c78e0b';
        const ack = await Query.commitAck(undefined, { hash }, { factomd });
        assert.deepStrictEqual(ack, {
            entryHash: '6501bcfb818c5d24130c9ecd520071163a8692942f7fc11d48ea44e340c14904',
            commitHash: hash
        });
    });

    it('should get the leaves of CurrentMinute from the currentMinute resolver', async () => {
        const currentMinute = await Query.currentMinute(undefined, undefined, {
            factomd
        });

        assert.hasAllKeys(currentMinute, [
            'leaderHeight',
            'directoryBlockHeight',
            'minute',
            'currentBlockStartTime',
            'currentMinuteStartTime',
            'currentTime',
            'directoryBlockInSeconds',
            'stallDetected',
            'faultTimeout',
            'roundTimeout'
        ]);
        assert.isNumber(currentMinute.leaderHeight);
        assert.isNumber(currentMinute.directoryBlockHeight);
        assert.isNumber(currentMinute.minute);
        assert.isNumber(currentMinute.currentBlockStartTime);
        assert.isNumber(currentMinute.currentMinuteStartTime);
        assert.isNumber(currentMinute.currentTime);
        assert.isNumber(currentMinute.directoryBlockInSeconds);
        assert.isBoolean(currentMinute.stallDetected);
        assert.isNumber(currentMinute.faultTimeout);
        assert.isNumber(currentMinute.roundTimeout);
    });

    it('should get the leaves of DirectoryBlock from the directoryBlock resolver', async () => {
        const hash = '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5';
        const directoryBlock = await Query.directoryBlock(
            undefined,
            { hash },
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, {
            hash,
            height: 196398,
            timestamp: 1560187680
        });
    });

    it('should get the leaves of DirectoryBlock from the directoryBlock resolver', async () => {
        const height = 196398;
        const directoryBlock = await Query.directoryBlockByHeight(
            undefined,
            { height },
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, {
            hash: '02ce63ba6c77b475444e0c4cb20f9e7701ca2406a3a7dc1c6ecf54e16bef85e5',
            height,
            timestamp: 1560187680
        });
    });

    it('should get the leaves of DirectoryBlock from the directoryBlockHead resolver', async () => {
        const directoryBlock = await Query.directoryBlockHead(undefined, undefined, {
            factomd
        });
        assert.hasAllKeys(directoryBlock, ['height', 'hash', 'timestamp']);
        assert.isNumber(directoryBlock.height);
        assert.isString(directoryBlock.hash);
        assert.isNumber(directoryBlock.timestamp);
    });

    it('should get the leaves of Entry from the entry resolver', async () => {
        const hash = 'ef67f1a08b849ae188ae71fe0cdbdd3d6bd0c2d4df661c890d339787cbc5ee6b';
        const entry = await Query.entry(undefined, { hash }, { factomd });
        assert.strictEqual(entry.hash, hash);
        assert.strictEqual(
            entry.chain,
            '3298ab1c248eae58ee557948d89062b18f81ebcf6cc386233470ef5e4beee12a'
        );
        assert.strictEqual(entry.timestamp, 1560183960000);
        assert.isString(entry.content);
        assert.isArray(entry.externalIds);
        entry.externalIds.forEach(id => assert.isString(id));
    });

    it('should get the leaves of EntryBlock from the entryBlock resolver', async () => {
        const hash = '4dd4d88ab67c272817f78672768f5bac546743546c7755949f9c20a4583a0c9c';
        const entryBlock = await Query.entryBlock(undefined, { hash }, { factomd });
        assert.strictEqual(entryBlock.hash, hash);
        assert.strictEqual(
            entryBlock.chain,
            '4a35522c834022a4153c4ac92f61f22fad640647f91a21a65cf632f738717966'
        );
        assert.strictEqual(entryBlock.height, 1381);
        assert.strictEqual(entryBlock.timestamp, 1560238680000);
    });

    it('should get the leaves of EntryCommitAck from the entryAck resolver', async () => {
        const hash = '2346db420b35ee2c8e811305c36ea140ff47c59af70221be41ef3285e324d264';
        const chain = '9b5c6dbec96faef4f855182fa8d1475427eed27fc18f4c8deec588d1c252b7f8';
        const ack = await Query.entryAck(undefined, { hash, chain }, { factomd });
        assert.deepStrictEqual(ack, {
            entryHash: hash,
            commitHash: '66555bb630cfad18702104c3af62cda8cb1d4b247f15e885c27109987816bcc2'
        });
    });
});
