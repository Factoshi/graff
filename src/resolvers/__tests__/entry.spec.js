const { InMemoryLRUCache } = require('apollo-server-caching');
const { FactomdDataSource } = require('../../datasource');
const { cli } = require('../../factom');
const { entryResolvers, entryQueries } = require('../Entry');
const { randomBytes } = require('crypto');

const factomd = new FactomdDataSource(cli);
const cache = new InMemoryLRUCache();
factomd.initialize({
    cache,
    context: {}
});
const context = { dataSources: { factomd } };

describe('Entry Resolvers', () => {
    afterEach(() => cache.flush());

    it('Should resolve an entry hash', async () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const response = await entryQueries.entry(undefined, { hash }, context);
        expect(response).toEqual({ hash });
    });

    it('Should return null for an entry that does not exist', async () => {
        const response = await entryQueries.entry(
            undefined,
            { hash: randomBytes(32).toString('hex') },
            context
        );
        expect(response).toBeNull();
    });

    it('Should resolve the chain an entry belongs to', async () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const chain = await entryResolvers.chainId({ hash }, undefined, context);
        expect(chain).toBe(
            'dc3a545d76d04f49faa32b9881d32f00594ff43c1d2b963772d3f640645846b8'
        );
    });

    it('Should resolve the timestamp of an entry', async () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const timestamp = await entryResolvers.timestamp({ hash }, undefined, context);
        expect(timestamp).toBe(1561664100000);
    });

    it('Should resolve the external IDs of an entry', async () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const expected = await cli
            .getEntry(hash)
            .then(({ extIds }) => extIds.map(id => id.toString('base64')));
        const extIds = await entryResolvers.externalIds({ hash }, undefined, context);
        expect(extIds).toEqual(expected);
    });

    it('Should resolve the content of an entry', async () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const expected = await cli
            .getEntry(hash)
            .then(({ content }) => content.toString('base64'));
        const content = await entryResolvers.content({ hash }, undefined, context);
        expect(content).toEqual(expected);
    });

    it('Should resolve the keyMR of the entry block context', async () => {
        const hash = '135e3dc2c365cb1cf8d2343181cb2cd1fffe244d05c821ebb75774b4af637260';
        const entryBlock = await entryResolvers.entryBlock({ hash }, undefined, context);
        expect(entryBlock).toEqual({
            keyMR: '39664a8a31c48ded754989b96999f0087403cf53ddbd6433eccf35eb608d120c'
        });
    });
});
