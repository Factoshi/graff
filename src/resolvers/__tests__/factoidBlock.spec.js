const { factoidBlockRootQueries, factoidBlockResolvers } = require('../FactoidBlock');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { assert } = require('chai');

describe('FactoidBlock resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get the leaves of FactoidBlock from the factoidBlock resolver using a hash.', async () => {
        const hash = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const height = 10;
        const factoidBlock = await factoidBlockRootQueries.factoidBlock(
            undefined,
            { arg: hash },
            { factomd }
        );
        assert.deepStrictEqual(factoidBlock, { hash });
    });

    it('Should get the leaves of FactoidBlock from the factoidBlock resolver using a height.', async () => {
        const hash = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const height = 10;
        const factoidBlock = await factoidBlockRootQueries.factoidBlock(
            undefined,
            { arg: height },
            { factomd }
        );
        assert.deepStrictEqual(factoidBlock, { hash });
    });

    it('Should get the leaves of FactoidBlock from the factoidBlockHead resolver', async () => {
        const factoidBlock = await factoidBlockRootQueries.factoidBlockHead(
            undefined,
            undefined,
            { factomd }
        );
        assert.hasAllKeys(factoidBlock, ['hash']);
        assert.isString(factoidBlock.hash);
    });

    it('Should resolve the height field', async () => {
        const hash = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const factoidBlockHeight = await factoidBlockResolvers.height(
            { hash },
            {},
            { factomd }
        );
        assert.strictEqual(factoidBlockHeight, 10);
    });

    it('Should resolve the hash for the previousBlock field', async () => {
        const hash = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const previousBlock = await factoidBlockResolvers.previousBlock(
            { hash },
            {},
            { factomd }
        );
        assert.deepStrictEqual(previousBlock, {
            hash: '12bfddc1e888a144352db3e50366ae3f022e5a7abe9d3ad911d66fddbbdfd241'
        });
    });

    it('Should resolve the hash for the nextBlock field', async () => {
        const hash = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const nextBlock = await factoidBlockResolvers.nextBlock(
            { hash },
            {},
            { factomd }
        );
        assert.deepStrictEqual(nextBlock, {
            hash: '1ce2a6114650bc6695f6714526c5170e7f93def316a3ea21ab6e3fa75007b770'
        });
    });

    it('Should get the entryCrediRate', async () => {
        const hash = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const entryCrediRate = await factoidBlockResolvers.entryCreditRate(
            { hash },
            {},
            { factomd }
        );
        assert.deepStrictEqual(entryCrediRate, 666600);
    });

    it('Should get a page of all of the transactions', async () => {
        const hash = '114db7a984edbd20c79657fc79b9130be41c5feaf193eba585a6a612a42346f4';
        const allTransactions = await factoidBlockResolvers.transactions(
            { hash },
            {},
            { factomd }
        );
        assert.hasAllKeys(allTransactions, [
            'transactions',
            'totalCount',
            'offset',
            'pageLength',
            'finalPage'
        ]);
        assert.strictEqual(allTransactions.totalCount, 106);
        assert.lengthOf(allTransactions.transactions, 106);
        assert.strictEqual(allTransactions.offset, 0);
        assert.strictEqual(allTransactions.pageLength, 106);
        assert.isTrue(allTransactions.finalPage);
        allTransactions.transactions.forEach(tx => {
            assert.hasAllKeys(tx, [
                'hash',
                'timestamp',
                'inputs',
                'factoidOutputs',
                'entryCreditOutputs',
                'totalInputs',
                'totalFactoidOutputs',
                'totalEntryCreditOutputs',
                'fees',
                'block'
            ]);
            tx.inputs.forEach(input => assert.hasAllKeys(input, ['address', 'amount']));
            tx.factoidOutputs.forEach(output =>
                assert.hasAllKeys(output, ['address', 'amount'])
            );
            tx.entryCreditOutputs.forEach(output =>
                assert.hasAllKeys(output, ['address', 'amount'])
            );
            assert.isString(tx.hash);
            assert.isNumber(tx.timestamp);
            assert.isNumber(tx.totalInputs);
            assert.isNumber(tx.totalFactoidOutputs);
            assert.isNumber(tx.totalEntryCreditOutputs);
            assert.isNumber(tx.fees);
            assert.hasAllKeys(tx.block, ['hash']);
        });
    });

    it('Should get the first 20 transactions', async () => {
        const hash = '114db7a984edbd20c79657fc79b9130be41c5feaf193eba585a6a612a42346f4';
        const first20 = await factoidBlockResolvers.transactions(
            { hash },
            { offset: 0, first: 20 },
            { factomd }
        );

        assert.strictEqual(first20.totalCount, 106);
        assert.lengthOf(first20.transactions, 20);
        assert.strictEqual(first20.offset, 0);
        assert.strictEqual(first20.pageLength, 20);
        assert.isFalse(first20.finalPage);
        assert.strictEqual(
            first20.transactions[0].hash,
            'a0b2399f8293d89a5c14a5bf15cc560f0dc506ba1f011a4b7f83163231acc373'
        );
        assert.strictEqual(
            first20.transactions[19].hash,
            'f07c3186471f00bb390b6a70513f353075b165ca24cf54b548a83aa389a16fd3'
        );
    });

    it('Should get the last 20 transactions', async () => {
        const hash = '114db7a984edbd20c79657fc79b9130be41c5feaf193eba585a6a612a42346f4';
        const last20 = await factoidBlockResolvers.transactions(
            { hash },
            { offset: 86, first: 20 },
            { factomd }
        );

        assert.strictEqual(last20.totalCount, 106);
        assert.lengthOf(last20.transactions, 20);
        assert.strictEqual(last20.offset, 86);
        assert.strictEqual(last20.pageLength, 20);
        assert.isTrue(last20.finalPage);
        assert.strictEqual(
            last20.transactions[0].hash,
            '8fa12f2a4a44d1dd18b51fa1fa44c7f288896068fea8ae7dbb9e5e7e9ef3ee12'
        );
        assert.strictEqual(
            last20.transactions[19].hash,
            '033b5837e81bad4200b72afa9bb1b651433b283d577368dd8f4974b70c9512f7'
        );
    });

    it('Should resolve the directoryBlock field', async () => {
        const hash = '114db7a984edbd20c79657fc79b9130be41c5feaf193eba585a6a612a42346f4';
        const directoryBlock = await factoidBlockResolvers.directoryBlock(
            { hash },
            {},
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, {
            hash: '9a09d516bdc6838345c0ca76213e2d3ab2460495e458f1c120acfc5e07df54db'
        });
    });
});
