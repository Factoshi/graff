import { QueryResolvers } from '../types/resolvers';
import { adminBlockRootQueries } from './AdminBlock';
import { entryBlockRootQueries } from './EntryBlock';
import { ackRootQueries } from './EntryCommitAck';
import { entryRootQueries } from './Entry';
import { entryCreditBlockRootQueries } from './EntryCreditBlock';
import { factoidBlockRootQueries } from './FactoidBlock';

export const Query: QueryResolvers = {
    ...adminBlockRootQueries,
    ...ackRootQueries,
    ...entryBlockRootQueries,
    ...entryRootQueries,
    ...entryCreditBlockRootQueries,
    ...factoidBlockRootQueries,

    balances: async (root, { addresses }, { factomd }) => {
        const balances = await factomd.balance.loadMany(addresses);
        return balances.map((balance, i) => ({
            amount: balance,
            publicAddress: addresses[i]
        }));
    },

    currentMinute: async (root, args, { factomd }) => {
        const currentMinute = await factomd.currentMinute.load();
        return {
            leaderHeight: currentMinute.leaderheight,
            directoryBlockHeight: currentMinute.directoryblockheight,
            minute: currentMinute.minute,
            currentBlockStartTime: currentMinute.currentblockstarttime,
            currentMinuteStartTime: currentMinute.currentminutestarttime,
            currentTime: currentMinute.currenttime,
            directoryBlockInSeconds: currentMinute.directoryblockinseconds,
            stallDetected: currentMinute.stalldetected,
            faultTimeout: currentMinute.faulttimeout,
            roundTimeout: currentMinute.roundtimeout
        };
    },

    entryCreditRate: async (root, args, { factomd }) => {
        const { rate } = await factomd.entryCreditRate.load();
        return rate;
    },

    factoidTransactionAck: async (root, { hash }, { factomd }) => {
        const factoidTransactionAck = await factomd.ack.load({ hash, chainid: 'f' });
        return {
            hash: factoidTransactionAck.txid,
            txTimestamp: factoidTransactionAck.transactiondate,
            blockTimestamp: factoidTransactionAck.blockdate,
            status: factoidTransactionAck.status
        };
    },

    heights: async (root, args, { factomd }) => {
        const heights = await factomd.heights.load();
        return {
            leaderHeight: heights.leaderheight,
            directoryBlockHeight: heights.directoryblockheight,
            entryBlockHeight: heights.entryblockheight,
            entryHeight: heights.entryheight
        };
    },

    pendingEntries: async (root, args, { factomd }) => {
        const pendingEntries = await factomd.pendingEntries.load();
        return { totalCount: pendingEntries.length };
    },

    pendingTransactions: async (root, args, { factomd }) => {
        const pendingTransactions = await factomd.pendingTransactions.load();
        return { totalCount: pendingTransactions.length };
    },

    properties: async (root, args, { factomd }) => {
        const properties = await factomd.properties.load();
        // TODO: add GQL API version from env vars
        return {
            factomdAPIVersion: properties.factomdapiversion,
            factomdVersion: properties.factomdversion,
            graphQLAPIVersion: 'TODO'
        };
    }
};
