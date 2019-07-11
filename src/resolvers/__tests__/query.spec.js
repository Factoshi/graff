const { query } = require('../Query');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { randomBytes } = require('crypto');

const generateMockPendingEntriesMethod = length => ({
    factomd: {
        pendingEntries: {
            load: async () =>
                Array(length)
                    .fill(0)
                    .map(() => ({
                        entryhash: randomBytes(32).toString('hex'),
                        chainid: randomBytes(32).toString('hex'),
                        status: 'TransactionAck'
                    }))
        }
    }
});

const generateMockPendingTransactionsMethod = length => ({
    factomd: {
        pendingTransactions: {
            load: async () =>
                Array(length)
                    .fill(0)
                    .map(() => ({
                        hash: randomBytes(32).toString('hex'),
                        status: 'TransactionAck',
                        inputs: [],
                        factoidOutputs: [],
                        entryCreditOutputs: [],
                        totalInputs: Math.floor(Math.random() * 10),
                        totalFactoidOutputs: Math.floor(Math.random() * 10),
                        totalEntryCreditOutputs: Math.floor(Math.random() * 10),
                        fees: Math.floor(Math.random() * 10)
                    }))
        }
    }
});

describe('Query Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get an array of the leaves of Address from the balances resolver', async () => {
        ecAddress = 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q';
        fctAddress = 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv';
        const balances = await query.balances(
            undefined,
            { addresses: [ecAddress, fctAddress] },
            { factomd }
        );
        expect(Array.isArray(balances)).toBe(true);
        balances.forEach(balance => {
            expect(typeof balance.publicAddress).toBe('string');
            expect(typeof balance.amount).toBe('number');
        });
    });

    it('Should get the leaves of CurrentMinute from the currentMinute resolver', async () => {
        const currentMinute = await query.currentMinute(undefined, undefined, {
            factomd
        });
        expect(typeof currentMinute.leaderHeight).toBe('number');
        expect(typeof currentMinute.directoryBlockHeight).toBe('number');
        expect(typeof currentMinute.minute).toBe('number');
        expect(typeof currentMinute.currentBlockStartTime).toBe('number');
        expect(typeof currentMinute.currentMinuteStartTime).toBe('number');
        expect(typeof currentMinute.currentTime).toBe('number');
        expect(typeof currentMinute.directoryBlockInSeconds).toBe('number');
        expect(typeof currentMinute.faultTimeout).toBe('number');
        expect(typeof currentMinute.roundTimeout).toBe('number');
        expect(typeof currentMinute.stallDetected).toBe('boolean');
    });

    it('Should get the entry credit rate', async () => {
        const ecRate = await query.entryCreditRate(undefined, undefined, { factomd });
        expect(typeof ecRate).toBe('number');
    });

    it('Should get the leaves of FactoidTransactionAck from the factoidTransactionAck resolver', async () => {
        const hash = 'b853f921bb6598b20c5054fa422a83a6a128ccd3c0fed2aaf03f0060d6805744';
        const ack = await query.factoidTransactionAck(undefined, { hash }, { factomd });
        expect(ack).toEqual({
            hash,
            txTimestamp: 1560361379165,
            blockTimestamp: 1560361080000,
            status: 'DBlockConfirmed'
        });
    });

    it('Should get the leaves of Heights from the heights resolver', async () => {
        const heights = await query.heights(undefined, undefined, { factomd });
        expect(typeof heights.leaderHeight).toBe('number');
        expect(typeof heights.directoryBlockHeight).toBe('number');
        expect(typeof heights.entryBlockHeight).toBe('number');
        expect(typeof heights.entryHeight).toBe('number');
    });

    it('Should get paginated pending entries', async () => {
        const pendingEntries = await query.pendingEntries(undefined, {}, { factomd });
        expect(typeof pendingEntries.totalCount).toBe('number');
        expect(typeof pendingEntries.offset).toBe('number');
        expect(typeof pendingEntries.pageLength).toBe('number');
        expect(Array.isArray(pendingEntries.pendingEntries)).toBe(true);
    });

    it('Should get first 20 paginated pending entries', async () => {
        const mock = generateMockPendingEntriesMethod(40);
        const first20 = await query.pendingEntries(
            undefined,
            { offset: 0, first: 20 },
            mock
        );
        expect(first20.totalCount).toBe(40);
        expect(first20.pendingEntries).toHaveLength(20);
        expect(first20.offset).toBe(0);
        expect(first20.pageLength).toBe(20);
    });

    it('Should return 0 for paginated entry values', async () => {
        const mock = generateMockPendingEntriesMethod(0);
        const emptyPage = await query.pendingEntries(
            undefined,
            { offset: 0, first: 20 },
            mock
        );
        expect(emptyPage.totalCount).toBe(0);
        expect(emptyPage.pendingEntries).toHaveLength(0);
        expect(emptyPage.offset).toBe(0);
        expect(emptyPage.pageLength).toBe(0);
    });

    it('Should return 0 for paginated entry values when offset is grester than 0', async () => {
        const mock = generateMockPendingEntriesMethod(0);
        const emptyPage = await query.pendingEntries(
            undefined,
            { offset: 20, first: 20 },
            mock
        );
        expect(emptyPage.totalCount).toBe(0);
        expect(emptyPage.pendingEntries).toHaveLength(0);
        expect(emptyPage.offset).toBe(20);
        expect(emptyPage.pageLength).toBe(0);
    });

    it('Should get paginated pending transactions', async () => {
        const pendingTransactions = await query.pendingTransactions(
            undefined,
            {},
            { factomd }
        );
        expect(typeof pendingTransactions.totalCount).toBe('number');
        expect(typeof pendingTransactions.offset).toBe('number');
        expect(typeof pendingTransactions.pageLength).toBe('number');
        expect(Array.isArray(pendingTransactions.pendingTransactions)).toBe(true);
    });

    it('Should get the first 20 paginated pending transactions', async () => {
        const mock = generateMockPendingTransactionsMethod(40);
        const first20 = await query.pendingTransactions(
            undefined,
            { offset: 0, first: 20 },
            mock
        );
        expect(first20.totalCount).toBe(40);
        expect(first20.offset).toBe(0);
        expect(first20.pageLength).toBe(20);
        expect(first20.pendingTransactions).toHaveLength(20);
    });

    it('Should get the last 20 paginated pending transactions', async () => {
        const mock = generateMockPendingTransactionsMethod(40);
        const last20 = await query.pendingTransactions(
            undefined,
            { offset: 20, first: 20 },
            mock
        );
        expect(last20.totalCount).toBe(40);
        expect(last20.offset).toBe(20);
        expect(last20.pageLength).toBe(20);
        expect(last20.pendingTransactions).toHaveLength(20);
    });

    it('Should return 0 for paginated transaction values', async () => {
        const mock = generateMockPendingTransactionsMethod(0);
        const emptyPage = await query.pendingTransactions(
            undefined,
            { offset: 0, first: 20 },
            mock
        );
        expect(emptyPage.totalCount).toBe(0);
        expect(emptyPage.offset).toBe(0);
        expect(emptyPage.pageLength).toBe(0);
        expect(emptyPage.pendingTransactions).toHaveLength(0);
    });

    it('Should get the leaves of Properties from the properties resolver', async () => {
        const properties = await query.properties(undefined, undefined, { factomd });
        expect(typeof properties.factomdVersion).toBe('string');
        expect(typeof properties.factomdAPIVersion).toBe('string');
    });

    it('Should get an entry receipt', async () => {
        const hash = 'f15aa73fbe29c9e5a6a53b4fbac16f8917bc7fb5441b32cd32453195c808fb5d';
        const receipt = await query.receipt(undefined, { hash }, { factomd });
        expect(receipt.entry).toEqual({ hash });
        expect(receipt.bitcoinBlockHash).toBe(
            '0000000000000000001cc4b4bbb96148080072ab215a61bd050825fcdeca4980'
        );
        expect(receipt.bitcoinTransactionHash).toBe(
            'e55bd0093be4a30d988532ac27a4544b95d6fc4e638c9a626c2ede5c87a75eae'
        );
        receipt.merkleBranch.forEach(branch => {
            expect(typeof branch.left).toBe('string');
            expect(typeof branch.right).toBe('string');
            expect(typeof branch.top).toBe('string');
        });
    });
});
