const { Query } = require('../Query');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { assert } = require('chai');
const {
    generateMockPendingEntriesMethod,
    generateMockPendingTransactionsMethod
} = require('./testHelpers');

describe('Query Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get an array of the leaves of Address from the balances resolver', async () => {
        ecAddress = 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q';
        fctAddress = 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv';
        const balances = await Query.balances(
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

    it('Should get the entry credit rate', async () => {
        const ecRate = await Query.entryCreditRate(undefined, undefined, { factomd });
        assert.isNumber(ecRate);
    });

    it('Should get the leaves of FactoidTransactionAck from the factoidTransactionAck resolver', async () => {
        const hash = 'b853f921bb6598b20c5054fa422a83a6a128ccd3c0fed2aaf03f0060d6805744';
        const ack = await Query.factoidTransactionAck(undefined, { hash }, { factomd });
        assert.deepStrictEqual(ack, {
            hash,
            txTimestamp: 1560361379165,
            blockTimestamp: 1560361080000,
            status: 'DBlockConfirmed'
        });
    });

    it('Should get the leaves of Heights from the heights resolver', async () => {
        const heights = await Query.heights(undefined, undefined, { factomd });
        assert.hasAllKeys(heights, [
            'leaderHeight',
            'directoryBlockHeight',
            'entryBlockHeight',
            'entryHeight'
        ]);
        Object.values(heights).forEach(assert.isNumber);
    });

    it('Should get paginated pending entries', async () => {
        const pendingEntries = await Query.pendingEntries(undefined, {}, { factomd });
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
        const first20 = await Query.pendingEntries(
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
        const first20 = await Query.pendingEntries(
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
        const emptyPage = await Query.pendingEntries(
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
        const pendingTransactions = await Query.pendingTransactions(
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
        const first20 = await Query.pendingTransactions(
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
        const last20 = await Query.pendingTransactions(
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
        const emptyPage = await Query.pendingTransactions(
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
        const properties = await Query.properties(undefined, undefined, { factomd });
        assert.hasAllKeys(properties, ['factomdVersion', 'factomdAPIVersion']);
        Object.values(properties).forEach(assert.isString);
    });
});
