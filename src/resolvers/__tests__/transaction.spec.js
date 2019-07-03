const { transactionQueries, transactionResolvers } = require('../Transaction');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { assert } = require('chai');

describe('Transaction Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get the transaction hash from the root resolver', async () => {
        const hash = '648452235ac39cf4fdaf674d5ff8039ea77d75df62f5e7605fab6d2f143973d7';
        const transaction = await transactionQueries.transaction(
            undefined,
            { hash },
            { factomd }
        );
        assert.deepStrictEqual(transaction, { hash });
    });

    it('Should resolve the timestamp', async () => {
        const hash = '648452235ac39cf4fdaf674d5ff8039ea77d75df62f5e7605fab6d2f143973d7';
        const timestamp = await transactionResolvers.timestamp({ hash }, undefined, {
            factomd
        });
        assert.strictEqual(timestamp, 1562054448339);
    });

    it('Should resolve the inputs', async () => {
        const hash = '648452235ac39cf4fdaf674d5ff8039ea77d75df62f5e7605fab6d2f143973d7';
        const inputs = await transactionResolvers.inputs({ hash }, undefined, {
            factomd
        });
        assert.deepStrictEqual(inputs, [
            {
                address: 'FA3QMfvva5GeTBiVRJCWk22Pj7mUcGA3vV5gQCm8TSad18yzGQzh',
                amount: 322899000000
            },
            {
                address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
                amount: 214500
            }
        ]);
    });

    it('Should resolve the factoid outputs', async () => {
        const hash = '648452235ac39cf4fdaf674d5ff8039ea77d75df62f5e7605fab6d2f143973d7';
        const factoidOutputs = await transactionResolvers.factoidOutputs(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(factoidOutputs, [
            {
                address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
                amount: 322899000000
            }
        ]);
    });

    it('Should resolve the entry credit outputs', async () => {
        const hash = '71c733ed8d2a8866181db42161d7d9fb02bedbd21de4e8009f2e6506249f968d';
        const entryCreditOutputs = await transactionResolvers.entryCreditOutputs(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(entryCreditOutputs, [
            {
                address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
                amount: 24450000000
            }
        ]);
    });

    it('Should resolve the total inputs', async () => {
        const hash = '648452235ac39cf4fdaf674d5ff8039ea77d75df62f5e7605fab6d2f143973d7';
        const totalInputs = await transactionResolvers.totalInputs({ hash }, undefined, {
            factomd
        });
        assert.strictEqual(totalInputs, 322899214500);
    });

    it('Should resolve the total factoid outputs', async () => {
        const hash = '648452235ac39cf4fdaf674d5ff8039ea77d75df62f5e7605fab6d2f143973d7';
        const totalFactoidOutputs = await transactionResolvers.totalFactoidOutputs(
            { hash },
            undefined,
            { factomd }
        );
        assert.strictEqual(totalFactoidOutputs, 322899000000);
    });

    it('Should resolve the total entry credit outputs', async () => {
        const hash = '71c733ed8d2a8866181db42161d7d9fb02bedbd21de4e8009f2e6506249f968d';
        const totalEntryCreditOutputs = await transactionResolvers.totalEntryCreditOutputs(
            { hash },
            undefined,
            { factomd }
        );
        assert.strictEqual(totalEntryCreditOutputs, 24450000000);
    });

    it('Should resolve the fees', async () => {
        const hash = '648452235ac39cf4fdaf674d5ff8039ea77d75df62f5e7605fab6d2f143973d7';
        const fees = await transactionResolvers.fees({ hash }, undefined, { factomd });
        assert.strictEqual(fees, 214500);
    });

    it('Should resolve the factoid block hash', async () => {
        const hash = '648452235ac39cf4fdaf674d5ff8039ea77d75df62f5e7605fab6d2f143973d7';
        const block = await transactionResolvers.block({ hash }, undefined, { factomd });
        assert.deepStrictEqual(block, {
            hash: '93e67cf0a9a6b473d9433457a083442c3a2d14dd811f00a3a1191338026c7dc3'
        });
    });
});
