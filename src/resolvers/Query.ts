import { QueryResolvers } from '../types/resolvers';
import { adminBlockQueries } from './AdminBlock';
import { entryBlockQueries } from './EntryBlock';
import { ackQueries } from './EntryCommitAck';
import { entryQueries } from './Entry';
import { entryCreditBlockQueries } from './EntryCreditBlock';
import { factoidBlockQueries } from './FactoidBlock';
import { directoryBlockQueries } from './DirectoryBlock';
import { transactionQueries } from './Transaction';
import { handleEntryError } from './resolver-helpers';

export const query: QueryResolvers = {
    ...adminBlockQueries,
    ...ackQueries,
    ...directoryBlockQueries,
    ...entryBlockQueries,
    ...entryQueries,
    ...entryCreditBlockQueries,
    ...factoidBlockQueries,
    ...transactionQueries,
    balances: async (root, { addresses }, { dataSources }) => {
        const balances = await dataSources.factomd.getBalances(addresses);
        return balances.map((balance, i) => ({
            amount: balance,
            address: addresses[i]
        }));
    },
    currentMinute: async (root, args, { dataSources }) => {
        const currentMinute = await dataSources.factomd.getCurrentMinute();
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
    entryCreditRate: (root, args, { dataSources }) => {
        return dataSources.factomd.getEntryCreditRate();
    },
    factoidTransactionAck: async (root, { hash }, { dataSources }) => {
        const factoidTransactionAck = await dataSources.factomd.getAck({
            hash,
            chainid: 'f'
        });
        return {
            hash: factoidTransactionAck.txid,
            txTimestamp: factoidTransactionAck.transactiondate,
            blockTimestamp: factoidTransactionAck.blockdate,
            status: factoidTransactionAck.status
        };
    },
    heights: (root, args, { dataSources }) => {
        return dataSources.factomd.getHeights();
    },
    pendingEntries: async (root, { offset = 0, first = Infinity }, { dataSources }) => {
        const pendingEntries = await dataSources.factomd.getPendingEntries();
        const paginatedPendingEntries = pendingEntries
            .slice(offset!, offset! + first!)
            .map(({ entryhash, chainid, status }) => ({
                hash: entryhash,
                chainId: chainid,
                status
            }));
        return {
            totalCount: pendingEntries.length,
            offset: offset!,
            pageLength: paginatedPendingEntries.length,
            pendingEntries: paginatedPendingEntries
        };
    },
    pendingTransactions: async (
        root,
        { offset = 0, first = Infinity },
        { dataSources }
    ) => {
        const pendingTransactions = await dataSources.factomd.getPendingTransactions();
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
    properties: async (root, args, { dataSources }) => {
        const properties = await dataSources.factomd.getProperties();
        return {
            factomdAPIVersion: properties.factomdapiversion,
            factomdVersion: properties.factomdversion
        };
    },
    receipt: async (root, { hash }, { dataSources }) => {
        const receipt = await dataSources.factomd
            .getReceipt(hash)
            .catch(handleEntryError);
        return (
            receipt && {
                entry: { hash },
                bitcoinTransactionHash: receipt.receipt.bitcointransactionhash || null,
                bitcoinBlockHash: receipt.receipt.bitcoinblockhash || null,
                merkleBranch: receipt.receipt.merklebranch
            }
        );
    }
};
