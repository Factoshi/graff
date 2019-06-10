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

        assert.hasAllKeys(currentMinute, {
            leaderHeight: 196395,
            directoryBlockHeight: 196395,
            minute: 4,
            currentBlockStartTime: 1560186493561410300,
            currentMinuteStartTime: 1560186733528967200,
            currentTime: 1560186765763706000,
            directoryBlockInSeconds: 600,
            stallDetected: false,
            faultTimeout: 120,
            roundTimeout: 30
        });
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
});
