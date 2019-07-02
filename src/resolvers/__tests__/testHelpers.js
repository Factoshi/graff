const { randomBytes } = require('crypto');

exports.generateMockPendingEntriesMethod = len => ({
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

exports.generateMockPendingTransactionsMethod = len => ({
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
