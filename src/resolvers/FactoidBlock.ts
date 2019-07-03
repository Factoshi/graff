import { QueryResolvers, FactoidBlockResolvers, Transaction } from '../types/resolvers';
import { testPaginationInput, handleBlockError } from './resolver-helpers';

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const factoidBlockQueries: QueryResolvers = {
    factoidBlock: async (root, { hash }, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock
            .load(hash)
            .catch(handleBlockError);
        return factoidBlock && { hash: factoidBlock.keyMR };
    },
    factoidBlockByHeight: async (root, { height }, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock
            .load(height)
            .catch(handleBlockError);
        return factoidBlock && { hash: factoidBlock.keyMR };
    },
    factoidBlockHead: async (root, args, { factomd }) => {
        const directoryBlockHead = await factomd.directoryBlockHead.load();
        const factoidBlockHead = await factomd.factoidBlock.load(
            directoryBlockHead.factoidBlockRef
        );
        return { hash: factoidBlockHead.keyMR };
    }
};

export const factoidBlockResolvers: FactoidBlockResolvers = {
    height: async ({ hash }, args, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(hash!);
        return factoidBlock.directoryBlockHeight;
    },
    previousBlock: async ({ hash }, args, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(hash!);
        const previousBlock = await factomd.factoidBlock
            .load(factoidBlock.previousBlockKeyMR)
            .catch(handleBlockError);
        return previousBlock && { hash: previousBlock.keyMR };
    },
    nextBlock: async ({ hash }, args, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(hash!);
        const nextBlock = await factomd.factoidBlock
            .load(factoidBlock.directoryBlockHeight + 1)
            .catch(handleBlockError);
        return nextBlock && { hash: nextBlock.keyMR };
    },
    entryCreditRate: async ({ hash }, args, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(hash!);
        return factoidBlock.entryCreditRate;
    },
    transactions: async ({ hash }, { offset = 0, first = Infinity }, { factomd }) => {
        testPaginationInput(offset!, first!);
        const factoidBlock = await factomd.factoidBlock.load(hash as string);
        const transactions = factoidBlock.transactions
            .slice(offset!, offset! + first!)
            .map(tx => ({
                hash: tx.id,
                timestamp: tx.timestamp,
                inputs: tx.inputs,
                factoidOutputs: tx.factoidOutputs,
                entryCreditOutputs: tx.entryCreditOutputs,
                totalInputs: tx.totalInputs,
                totalFactoidOutputs: tx.totalFactoidOutputs,
                totalEntryCreditOutputs: tx.totalEntryCreditOutputs,
                fees: tx.feesPaid,
                block: { hash }
            })) as Transaction[];
        return {
            transactions,
            totalCount: factoidBlock.transactions.length,
            offset: offset as number,
            pageLength: transactions.length
        };
    },
    directoryBlock: async ({ hash }, args, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(hash!);
        const directoryBlock = await factomd.directoryBlock.load(
            factoidBlock.directoryBlockHeight
        );
        return { hash: directoryBlock.keyMR };
    }
};
