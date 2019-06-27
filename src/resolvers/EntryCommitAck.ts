import { QueryResolvers, Ack } from '../types/resolvers';

export const formatAckStatus = (ackStatus: any) => ({
    status: ackStatus.status as Ack,
    // convert to miliseconds for API consistency
    timestamp: ackStatus.blockdate ? ackStatus.blockdate * 1000 : null
});

export const formatAckResponse = (ack: any) => ({
    commitHash: ack.committxid,
    entryHash: ack.entryhash || null,
    commitStatus: formatAckStatus(ack.commitdata),
    entryStatus: ack.entrydata.status ? formatAckStatus(ack.entrydata) : null
});

export const ackRootQueries: QueryResolvers = {
    commitAck: async (root, { hash }, { factomd }) => {
        const ack = await factomd.ack.load({ hash, chainid: 'c' });
        return formatAckResponse(ack);
    },

    entryAck: async (root, { hash, chain }, { factomd }) => {
        const ack = await factomd.ack.load({ hash, chainid: chain });
        return formatAckResponse(ack);
    }
};
