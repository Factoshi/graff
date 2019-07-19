import { QueryResolvers, Ack } from '../types/resolvers';
import { FactomdDataSource } from '../dataSource';

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

export const resolveAck = (hash: string, chainid: string, factomd: FactomdDataSource) => {
    return factomd.getAck({ hash, chainid }).then(formatAckResponse);
};

export const ackQueries: QueryResolvers = {
    commitAck: async (root, { hash }, { dataSources }) =>
        resolveAck(hash, 'c', dataSources.factomd),
    entryAck: async (root, { hash, chainId }, { dataSources }) =>
        resolveAck(hash, chainId, dataSources.factomd)
};
