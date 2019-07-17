import { QueryResolvers, Ack } from '../types/resolvers';

export const formatAckStatus = (ackStatus: any) => ({
    status: ackStatus.status as Ack,
    // convert to miliseconds for API consistency
    timestamp: ackStatus.blockdate ? ackStatus.blockdate * 1000 : null
});

export const formatAckResponse = (ack: any) => ({
    commitHash: ack.committxid || null,
    entryHash: ack.entryhash || null,
    commitStatus: formatAckStatus(ack.commitdata),
    entryStatus: ack.entrydata.status ? formatAckStatus(ack.entrydata) : null
});

export const ackQueries: QueryResolvers = {
    commitAck: async (root, { hash }, { dataSources }) => {
        const ack = await dataSources.factomd.getAck({ hash, chainid: 'c' });
        return formatAckResponse(ack);
    },
    entryAck: async (root, { hash, chainId }, { dataSources }) => {
        const ack = await dataSources.factomd.getAck({ hash, chainid: chainId });
        return formatAckResponse(ack);
    }
};
