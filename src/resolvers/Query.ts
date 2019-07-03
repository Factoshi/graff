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

    pendingEntries: async (root, { offset = 0, first = Infinity }, { factomd }) => {
        const pendingEntries = (await factomd.pendingEntries.load()) as any[];
        const paginatedPendingEntries = pendingEntries
            .slice(offset!, offset! + first!)
            .map(({ entryhash, chainid, status }) => ({
                hash: entryhash,
                chain: chainid,
                status
            }));
        return {
            totalCount: pendingEntries.length,
            offset: offset!,
            pageLength: paginatedPendingEntries.length,
            pendingEntries: paginatedPendingEntries
        };
    },

    pendingTransactions: async (root, { offset = 0, first = Infinity }, { factomd }) => {
        const pendingTransactions = (await factomd.pendingTransactions.load()) as any[];
        const mapIO = (io: any) => ({ amount: io.amount, address: io.useraddress });
        const sumAmount = (acc: number, cur: any) => acc + cur.amount;
        const paginatedPendingTransactions = pendingTransactions
            .slice(offset!, offset! + first!)
            .map(tx => ({
                hash: tx.transactionid,
                status: tx.status,
                inputs: tx.inputs ? tx.inputs.map(mapIO) : [],
                factoidOutputs: tx.outputs ? tx.outputs.map(mapIO) : [],
                entryCreditOutputs: tx.ecoutputs ? tx.ecoutputs.map(mapIO) : [],
                totalInputs: tx.inputs ? tx.inputs.reduce(sumAmount, 0) : 0,
                totalFactoidOutputs: tx.outputs ? tx.outputs.reduce(sumAmount, 0) : 0,
                totalEntryCreditOutputs: tx.ecoutputs
                    ? tx.ecoutputs.reduce(sumAmount, 0)
                    : 0,
                // factomd has a bug where it will provide a non-zero fee value for pending coinbase transactions.
                fees: tx.inputs ? tx.fees : 0
            }));
        return {
            totalCount: pendingTransactions.length,
            offset: offset!,
            pageLength: paginatedPendingTransactions.length,
            pendingTransactions: paginatedPendingTransactions
        };
    },

    properties: async (root, args, { factomd }) => {
        const properties = await factomd.properties.load();
        return {
            factomdAPIVersion: properties.factomdapiversion,
            factomdVersion: properties.factomdversion
        };
    },
    receipt: async (root, { hash }, { factomd }) => {
        const receipt = await factomd.receipt.load(hash);
        return {
            entry: { hash },
            bitcoinTransactionHash: receipt.receipt.bitcointransactionhash || null,
            bitcoinBlockHash: receipt.receipt.bitcoinblockhash || null,
            merkleBranch: receipt.receipt.merklebranch
        };
    }
};
