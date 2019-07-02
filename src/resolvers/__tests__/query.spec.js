const { Query } = require('../Query');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { assert } = require('chai');
const { Ack } = require('../../types/resolvers');

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

    it('Should get the leaves of PaginatedPendingEntries from the pendingEntries resolver', async () => {
        const pendingEntries = await Query.pendingEntries(undefined, undefined, {
            factomd
        });
        assert.hasAllKeys(pendingEntries, ['totalCount']);
        assert.isNumber(pendingEntries.totalCount);
    });

    it('Should get the leaves of PaginatedPendingTransactions from the pendingTransactions resolver', async () => {
        const pendingTransactions = await Query.pendingTransactions(
            undefined,
            undefined,
            {
                factomd
            }
        );
        assert.hasAllKeys(pendingTransactions, ['totalCount']);
        assert.isNumber(pendingTransactions.totalCount);
    });

    it('Should get the leaves of Properties from the properties resolver', async () => {
        const properties = await Query.properties(undefined, undefined, { factomd });
        assert.hasAllKeys(properties, ['factomdVersion', 'factomdAPIVersion']);
        Object.values(properties).forEach(assert.isString);
    });
});
