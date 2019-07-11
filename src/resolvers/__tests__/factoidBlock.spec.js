const { factoidBlockQueries, factoidBlockResolvers } = require('../FactoidBlock');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { randomBytes } = require('crypto');
const { TransactionAddress } = require('factom');

describe('FactoidBlock resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should resolve the keyMR from the factoidBlock query', async () => {
        const hash = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const factoidBlock = await factoidBlockQueries.factoidBlock(
            undefined,
            { hash },
            { factomd }
        );
        expect(factoidBlock).toEqual({ keyMR: hash });
    });

    it('Should return null for a factoidBlock that does not exist', async () => {
        const factoidBlock = await factoidBlockQueries.factoidBlock(
            undefined,
            { hash: randomBytes(32).toString('hex') },
            { factomd }
        );
        expect(factoidBlock).toBeNull();
    });

    it('Should resolve the keyMR from the factoidBlockByHeight query', async () => {
        const hash = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const factoidBlock = await factoidBlockQueries.factoidBlockByHeight(
            undefined,
            { height: 10 },
            { factomd }
        );
        expect(factoidBlock).toEqual({ keyMR: hash });
    });

    it('Should return null for a factoidBlockByHeght that does not exist', async () => {
        const factoidBlock = await factoidBlockQueries.factoidBlockByHeight(
            undefined,
            { height: Number.MAX_SAFE_INTEGER },
            { factomd }
        );
        expect(factoidBlock).toBeNull();
    });

    it('Should resolve the keyMR from the factoidBlockHead query', async () => {
        const directoryBlockHead = await cli.getDirectoryBlockHead();
        const expected = await cli.getFactoidBlock(directoryBlockHead.factoidBlockRef);
        const factoidBlock = await factoidBlockQueries.factoidBlockHead(
            undefined,
            undefined,
            { factomd }
        );
        expect(factoidBlock).toEqual({ keyMR: expected.keyMR });
    });

    it('Should resolve the bodyMR field', async () => {
        const keyMR = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const bodyMR = await factoidBlockResolvers.bodyMR({ keyMR }, {}, { factomd });
        expect(bodyMR).toBe(
            'bd99abfabe12023b57c933bbb8a54dce5e3fe03ec048c9d47279615dc6ab7853'
        );
    });

    it('Should resolve the ledgerKeyMR field', async () => {
        const keyMR = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const ledgerKeyMR = await factoidBlockResolvers.ledgerKeyMR(
            { keyMR },
            {},
            { factomd }
        );
        expect(ledgerKeyMR).toBe(
            '27f86c84c7793465cb18f93a844c981e6d977e3f57d913e9180e2a54383a1875'
        );
    });

    it('Should resolve the keyMR for the previousBlock field', async () => {
        const keyMR = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const previousBlock = await factoidBlockResolvers.previousBlock(
            { keyMR },
            {},
            { factomd }
        );
        expect(previousBlock).toEqual({
            keyMR: '12bfddc1e888a144352db3e50366ae3f022e5a7abe9d3ad911d66fddbbdfd241'
        });
    });

    it('Should return null for a previousBlock that does not exist', async () => {
        const keyMR = 'a164ccbb77a21904edc4f2bb753aa60635fb2b60279c06ae01aa211f37541736';
        const previousBlock = await factoidBlockResolvers.previousBlock(
            { keyMR },
            undefined,
            { factomd }
        );
        expect(previousBlock).toBeNull();
    });

    it('Should resolve the keyMR for the nextBlock field', async () => {
        const keyMR = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const nextBlock = await factoidBlockResolvers.nextBlock(
            { keyMR },
            {},
            { factomd }
        );
        expect(nextBlock).toEqual({
            keyMR: '1ce2a6114650bc6695f6714526c5170e7f93def316a3ea21ab6e3fa75007b770'
        });
    });

    it('Should return null for a nextBlock that does not exist', async () => {
        const directoryBlockHead = await cli.getDirectoryBlockHead();
        const nextBlock = await factoidBlockResolvers.nextBlock(
            { keyMR: directoryBlockHead.factoidBlockRef },
            undefined,
            { factomd }
        );
        expect(nextBlock).toBeNull();
    });

    it('Should resolve the entryCrediRate', async () => {
        const keyMR = '05c7a500db98dfe393b296998b7d9b74e8f2d2cfeacd1d44c05cfb50bd2cbaf3';
        const entryCrediRate = await factoidBlockResolvers.entryCreditRate(
            { keyMR },
            {},
            { factomd }
        );
        expect(entryCrediRate).toBe(666600);
    });

    it('Should resolve a page of all of the transactions', async () => {
        const keyMR = '114db7a984edbd20c79657fc79b9130be41c5feaf193eba585a6a612a42346f4';
        const allTransactions = await factoidBlockResolvers.transactionPage(
            { keyMR },
            {},
            { factomd }
        );
        expect(allTransactions.totalCount).toBe(106);
        expect(allTransactions.transactions).toHaveLength(106);
        expect(allTransactions.offset).toBe(0);
        expect(allTransactions.pageLength).toBe(106);

        allTransactions.transactions.forEach(tx => {
            expect(typeof tx.hash).toBe('string');
            expect(typeof tx.timestamp).toBe('number');
            expect(Array.isArray(tx.inputs)).toBe(true);
            expect(Array.isArray(tx.factoidOutputs)).toBe(true);
            expect(Array.isArray(tx.entryCreditOutputs)).toBe(true);
            expect(typeof tx.totalInputs).toBe('number');
            expect(typeof tx.totalFactoidOutputs).toBe('number');
            expect(typeof tx.totalEntryCreditOutputs).toBe('number');
            expect(typeof tx.fees).toBe('number');
            expect(Array.isArray(tx.rcds)).toBe(true);
            tx.rcds.forEach(rcd => expect(typeof rcd).toBe('string'));
            expect(Array.isArray(tx.signatures)).toBe(true);
            tx.signatures.forEach(s => expect(typeof s).toBe('string'));
            expect(tx.factoidBlock).toEqual({ keyMR });
        });
    });

    it('Should resolve the first 20 transactions', async () => {
        const keyMR = '114db7a984edbd20c79657fc79b9130be41c5feaf193eba585a6a612a42346f4';
        const first20 = await factoidBlockResolvers.transactionPage(
            { keyMR },
            { offset: 0, first: 20 },
            { factomd }
        );
        expect(first20.totalCount).toBe(106);
        expect(first20.transactions).toHaveLength(20);
        expect(first20.offset).toBe(0);
        expect(first20.pageLength).toBe(20);
        expect(first20.transactions[0].hash).toBe(
            'a0b2399f8293d89a5c14a5bf15cc560f0dc506ba1f011a4b7f83163231acc373'
        );
        expect(first20.transactions[19].hash).toBe(
            'f07c3186471f00bb390b6a70513f353075b165ca24cf54b548a83aa389a16fd3'
        );
    });

    it('Should resolve the last 20 transactions', async () => {
        const keyMR = '114db7a984edbd20c79657fc79b9130be41c5feaf193eba585a6a612a42346f4';
        const last20 = await factoidBlockResolvers.transactionPage(
            { keyMR },
            { offset: 86, first: 20 },
            { factomd }
        );

        expect(last20.totalCount).toBe(106);
        expect(last20.transactions).toHaveLength(20);
        expect(last20.offset).toBe(86);
        expect(last20.pageLength).toBe(20);
        expect(last20.transactions[0].hash).toBe(
            '8fa12f2a4a44d1dd18b51fa1fa44c7f288896068fea8ae7dbb9e5e7e9ef3ee12'
        );
        expect(last20.transactions[19].hash).toBe(
            '033b5837e81bad4200b72afa9bb1b651433b283d577368dd8f4974b70c9512f7'
        );
    });

    it('Should resolve the directoryBlock field', async () => {
        const keyMR = '114db7a984edbd20c79657fc79b9130be41c5feaf193eba585a6a612a42346f4';
        const directoryBlock = await factoidBlockResolvers.directoryBlock(
            { keyMR },
            {},
            { factomd }
        );
        expect(directoryBlock).toEqual({
            keyMR: '9a09d516bdc6838345c0ca76213e2d3ab2460495e458f1c120acfc5e07df54db'
        });
    });
});
