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
});
