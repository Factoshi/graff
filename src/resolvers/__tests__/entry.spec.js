const { assert } = require('chai');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { entryResolvers, entryQueries } = require('../Entry');

describe('Entry Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should resolve an entry hash', () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const response = entryQueries.entry(undefined, { hash });
        assert.deepStrictEqual(response, { hash });
    });

    it('Should resolve the chain an entry belongs to', async () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const chain = await entryResolvers.chain({ hash }, undefined, { factomd });
        assert.strictEqual(
            chain,
            'dc3a545d76d04f49faa32b9881d32f00594ff43c1d2b963772d3f640645846b8'
        );
    });

    it('Should resolve the timestamp of an entry', async () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const timestamp = await entryResolvers.timestamp({ hash }, undefined, {
            factomd
        });
        assert.strictEqual(timestamp, 1561664100000);
    });

    it('Should resolve the external IDs of an entry', async () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const expected = await cli
            .getEntry(hash)
            .then(({ extIds }) => extIds.map(id => id.toString('base64')));
        const extIds = await entryResolvers.externalIds({ hash }, undefined, {
            factomd
        });
        assert.deepStrictEqual(extIds, expected);
    });

    it('Should resolve the content of an entry', async () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const expected = await cli
            .getEntry(hash)
            .then(({ content }) => content.toString('base64'));
        const content = await entryResolvers.content({ hash }, undefined, {
            factomd
        });
        assert.deepStrictEqual(content, expected);
    });

    it('Should resolve the leaves of the entry block context', async () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const entryBlock = await entryResolvers.entryBlock({ hash }, undefined, {
            factomd
        });
        assert.deepStrictEqual(entryBlock, {
            hash: '39664a8a31c48ded754989b96999f0087403cf53ddbd6433eccf35eb608d120c',
            timestamp: 1561663740 * 1000,
            height: 0
        });
    });
});
