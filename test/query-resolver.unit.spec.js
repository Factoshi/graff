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
        assert.containsAllKeys(adminBlock, ['hash']);
        assert.isString(adminBlock.hash);
    });

    it('should get the leaves of EntryBlock from the chainHead resolver', async () => {
        const chain = 'b47b83b04ba3b09305e7e02618c457c3fd82531a4ab81b16e73d780dfc2f3b18';
        const chainHead = await Query.chainHead(undefined, { chain }, { factomd });
        assert.containsAllKeys(chainHead, ['hash', 'chain', 'height']);
        assert.isString(chainHead.hash);
        assert.isString(chainHead.chain);
        assert.isNumber(chainHead.height);
    });
});
