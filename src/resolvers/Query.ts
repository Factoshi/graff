import { QueryResolvers } from '../types/resolvers';
import { adminBlockRootQueries } from './AdminBlock';
import { entryBlockRootQueries } from './EntryBlock';
import { ackRootQueries } from './EntryCommitAck';

export const Query: QueryResolvers = {
    ...adminBlockRootQueries,
    ...ackRootQueries,
    ...entryBlockRootQueries,

    balances: async (root, { addresses }, { factomd }) => {
        const balances = await factomd.balance.loadMany(addresses);
        return balances.map((balance, i) => ({
            amount: balance,
            publicAddress: addresses[i]
        }));
    },

    currentMinute: async (root, args, { factomd }) => {
        const currentMinute = await factomd.currentMinute.load();
        // All keys must be in camel case.
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

    entry: async (root, { hash }, { factomd }) => {
        const { chainIdHex, timestamp, extIds, content } = await factomd.entry.load(hash);
        return {
            hash,
            chain: chainIdHex,
            timestamp,
            externalIds: extIds.map(id => id.toString('base64')),
            content: content.toString('base64')
        };
    },

    entryBlock: async (root, { hash }, { factomd }) => {
        const {
            chainId: chain,
            timestamp,
            sequenceNumber: height
        } = await factomd.entryBlock.load(hash);
        return {
            hash,
            // convert to milliseconds
            timestamp: timestamp * 1000,
            chain,
            height
        };
    },

    entryCreditBlock: async (root, { arg }, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(arg);
        return {
            hash: entryCreditBlock.headerHash,
            height: entryCreditBlock.directoryBlockHeight
        };
    },

    entryCreditBlockHead: async (root, args, { factomd }) => {
        const directoryBlockHead = await factomd.directoryBlockHead.load();
        const entryCreditBlockHead = await factomd.entryCreditBlock.load(
            directoryBlockHead.entryCreditBlockRef
        );
        return {
            hash: entryCreditBlockHead.headerHash,
            height: entryCreditBlockHead.directoryBlockHeight
        };
    },

    entryCreditRate: async (root, args, { factomd }) => {
        const { rate } = await factomd.entryCreditRate.load();
        return rate;
    },

    factoidBlock: async (root, { arg }, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(arg);
        return {
            hash: factoidBlock.keyMR,
            height: factoidBlock.directoryBlockHeight,
            entryCreditRate: factoidBlock.entryCreditRate
        };
    },

    factoidBlockHead: async (root, args, { factomd }) => {
        const directoryBlockHead = await factomd.directoryBlockHead.load();
        const factoidBlockHead = await factomd.factoidBlock.load(
            directoryBlockHead.factoidBlockRef
        );
        return {
            hash: factoidBlockHead.keyMR,
            height: factoidBlockHead.directoryBlockHeight,
            entryCreditRate: factoidBlockHead.entryCreditRate
        };
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
