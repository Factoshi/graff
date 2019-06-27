const { ackRootQueries } = require('../EntryCommitAck');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { assert } = require('chai');
const { Ack } = require('../../types/resolvers');

describe('EntryAck Resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get the leaves of EntryCommitAck from the commitAck resolver', async () => {
        const hash = '5f3599d372e9dfe9dd7fe5f2a72743496e99209b0a5776c1e34622fcb3c78e0b';
        const ack = await ackRootQueries.commitAck(undefined, { hash }, { factomd });
        assert.deepStrictEqual(ack, {
            entryHash: '6501bcfb818c5d24130c9ecd520071163a8692942f7fc11d48ea44e340c14904',
            commitHash: hash,
            commitStatus: {
                timestamp: 1560269280000,
                status: Ack.DBlockConfirmed
            },
            entryStatus: {
                timestamp: 1560269280000,
                status: Ack.DBlockConfirmed
            }
        });
    });

    it('Should get the leaves of EntryCommitAck from the entryAck resolver', async () => {
        const hash = '2346db420b35ee2c8e811305c36ea140ff47c59af70221be41ef3285e324d264';
        const chain = '9b5c6dbec96faef4f855182fa8d1475427eed27fc18f4c8deec588d1c252b7f8';
        const ack = await ackRootQueries.entryAck(
            undefined,
            { hash, chain },
            { factomd }
        );
        assert.deepStrictEqual(ack, {
            entryHash: hash,
            commitHash:
                '66555bb630cfad18702104c3af62cda8cb1d4b247f15e885c27109987816bcc2',
            commitStatus: {
                timestamp: null,
                status: Ack.DBlockConfirmed
            },
            entryStatus: {
                timestamp: 1560269280000,
                status: Ack.DBlockConfirmed
            }
        });
    });
});
