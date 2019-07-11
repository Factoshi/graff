const { query } = require('../Query');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { assert } = require('chai');
const { randomBytes } = require('crypto');

const generateMockPendingEntriesMethod = len => ({
    factomd: {
        pendingEntries: {
            load: async () =>
                Array(len)
                    .fill(0)
                    .map(() => ({
                        entryhash: randomBytes(32).toString('hex'),
                        chainid: randomBytes(32).toString('hex'),
                        status: 'TransactionAck'
                    }))
        }
    }
});

const generateMockPendingTransactionsMethod = len => ({
    factomd: {
        pendingTransactions: {
            load: async () =>
                Array(len)
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
        assert.isArray(balances);
        balances.forEach(
            balance => assert.hasAllKeys[(balance, ('publicAddress', 'amount'))]
        );
        balances.forEach(balance => assert.isString(balance.publicAddress));
        balances.forEach(balance => assert.isNumber(balance.amount));
    });

    it('Should get the leaves of CurrentMinute from the currentMinute resolver', async () => {
        const currentMinute = await query.currentMinute(undefined, undefined, {
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

    it('Should get the entry credit rate', async () => {
        const ecRate = await query.entryCreditRate(undefined, undefined, { factomd });
        assert.isNumber(ecRate);
    });

    it('Should get the leaves of FactoidTransactionAck from the factoidTransactionAck resolver', async () => {
        const hash = 'b853f921bb6598b20c5054fa422a83a6a128ccd3c0fed2aaf03f0060d6805744';
        const ack = await query.factoidTransactionAck(undefined, { hash }, { factomd });
        assert.deepStrictEqual(ack, {
            hash,
            txTimestamp: 1560361379165,
            blockTimestamp: 1560361080000,
            status: 'DBlockConfirmed'
        });
    });

    it('Should get the leaves of Heights from the heights resolver', async () => {
        const heights = await query.heights(undefined, undefined, { factomd });
        assert.hasAllKeys(heights, [
            'leaderHeight',
            'directoryBlockHeight',
            'entryBlockHeight',
            'entryHeight'
        ]);
        Object.values(heights).forEach(assert.isNumber);
    });

    it('Should get paginated pending entries', async () => {
        const pendingEntries = await query.pendingEntries(undefined, {}, { factomd });
        assert.hasAllKeys(pendingEntries, [
            'totalCount',
            'offset',
            'pageLength',
            'pendingEntries'
        ]);
        assert.isNumber(pendingEntries.totalCount);
        assert.isNumber(pendingEntries.offset);
        assert.isNumber(pendingEntries.pageLength);
        assert.isArray(pendingEntries.pendingEntries);
    });

    it('Should get first 20 paginated pending entries', async () => {
        const mock = generateMockPendingEntriesMethod(40);
        const first20 = await query.pendingEntries(
            undefined,
            { offset: 0, first: 20 },
            mock
        );
        assert.strictEqual(first20.totalCount, 40);
        assert.lengthOf(first20.pendingEntries, 20);
        assert.strictEqual(first20.offset, 0);
        assert.strictEqual(first20.pageLength, 20);
    });

    it('Should return 0 for paginated entry values', async () => {
        const mock = generateMockPendingEntriesMethod(0);
        const first20 = await query.pendingEntries(
            undefined,
            { offset: 0, first: 20 },
            mock
        );
        assert.strictEqual(first20.totalCount, 0);
        assert.lengthOf(first20.pendingEntries, 0);
        assert.strictEqual(first20.offset, 0);
        assert.strictEqual(first20.pageLength, 0);
    });

    it('Should return 0 for paginated entry values when offset is grester than 0', async () => {
        const mock = generateMockPendingEntriesMethod(0);
        const emptyPage = await query.pendingEntries(
            undefined,
            { offset: 20, first: 20 },
            mock
        );
        assert.strictEqual(emptyPage.totalCount, 0);
        assert.lengthOf(emptyPage.pendingEntries, 0);
        assert.strictEqual(emptyPage.offset, 20);
        assert.strictEqual(emptyPage.pageLength, 0);
    });

    it('Should get paginated pending transactions', async () => {
        const pendingTransactions = await query.pendingTransactions(
            undefined,
            {},
            { factomd }
        );
        assert.hasAllKeys(pendingTransactions, [
            'totalCount',
            'offset',
            'pageLength',
            'pendingTransactions'
        ]);
        assert.isNumber(pendingTransactions.totalCount);
        assert.isNumber(pendingTransactions.offset);
        assert.isNumber(pendingTransactions.pageLength);
        assert.isArray(pendingTransactions.pendingTransactions);
        // There will always be at least a pending coinbase transactions
        assert.hasAllKeys(pendingTransactions.pendingTransactions[0], [
            'hash',
            'status',
            'inputs',
            'factoidOutputs',
            'entryCreditOutputs',
            'totalInputs',
            'totalFactoidOutputs',
            'totalEntryCreditOutputs',
            'fees'
        ]);
    });

    it('Should get the first 20 paginated pending transactions', async () => {
        const mock = generateMockPendingTransactionsMethod(40);
        const first20 = await query.pendingTransactions(
            undefined,
            { offset: 0, first: 20 },
            mock
        );
        assert.strictEqual(first20.totalCount, 40);
        assert.lengthOf(first20.pendingTransactions, 20);
        assert.strictEqual(first20.offset, 0);
        assert.strictEqual(first20.pageLength, 20);
    });

    it('Should get the last 20 paginated pending transactions', async () => {
        const mock = generateMockPendingTransactionsMethod(40);
        const last20 = await query.pendingTransactions(
            undefined,
            { offset: 20, first: 20 },
            mock
        );
        assert.strictEqual(last20.totalCount, 40);
        assert.lengthOf(last20.pendingTransactions, 20);
        assert.strictEqual(last20.offset, 20);
        assert.strictEqual(last20.pageLength, 20);
    });

    it('Should return 0 for paginated transaction values', async () => {
        const mock = generateMockPendingTransactionsMethod(0);
        const emptyPage = await query.pendingTransactions(
            undefined,
            { offset: 0, first: 20 },
            mock
        );
        assert.strictEqual(emptyPage.totalCount, 0);
        assert.lengthOf(emptyPage.pendingTransactions, 0);
        assert.strictEqual(emptyPage.offset, 0);
        assert.strictEqual(emptyPage.pageLength, 0);
    });

    it('Should get the leaves of Properties from the properties resolver', async () => {
        const properties = await query.properties(undefined, undefined, { factomd });
        assert.hasAllKeys(properties, ['factomdVersion', 'factomdAPIVersion']);
        Object.values(properties).forEach(assert.isString);
    });

    it('Should get an entry receipt', async () => {
        const hash = 'f15aa73fbe29c9e5a6a53b4fbac16f8917bc7fb5441b32cd32453195c808fb5d';
        const receipt = await query.receipt(undefined, { hash }, { factomd });
        assert.deepStrictEqual(receipt.entry, { hash });
        assert.strictEqual(
            receipt.bitcoinBlockHash,
            '0000000000000000001cc4b4bbb96148080072ab215a61bd050825fcdeca4980'
        );
        assert.strictEqual(
            receipt.bitcoinTransactionHash,
            'e55bd0093be4a30d988532ac27a4544b95d6fc4e638c9a626c2ede5c87a75eae'
        );
        receipt.merkleBranch.forEach(branch =>
            assert.hasAllKeys(branch, ['left', 'right', 'top'])
        );
    });
});
