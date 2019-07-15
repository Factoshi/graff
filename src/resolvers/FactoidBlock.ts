import { QueryResolvers, FactoidBlockResolvers, Transaction } from '../types/resolvers';
import { testPaginationInput, handleBlockError } from './resolver-helpers';
import { MAX_PAGE_LENGTH } from '../contants';

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const factoidBlockQueries: QueryResolvers = {
    factoidBlock: async (_, { hash }, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock
            .load(hash)
            .catch(handleBlockError);
        return factoidBlock && { keyMR: factoidBlock.keyMR };
    },
    factoidBlockByHeight: async (_, { height }, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock
            .load(height)
            .catch(handleBlockError);
        return factoidBlock && { keyMR: factoidBlock.keyMR };
    }
};

export const factoidBlockResolvers: FactoidBlockResolvers = {
    bodyMR: async ({ keyMR }, _, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(keyMR!);
        return factoidBlock.bodyMR;
    },
    ledgerKeyMR: async ({ keyMR }, _, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(keyMR!);
        return factoidBlock.ledgerKeyMR;
    },
    entryCreditRate: async ({ keyMR }, _, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(keyMR!);
        return factoidBlock.entryCreditRate;
    },
    previousBlock: async ({ keyMR }, _, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(keyMR!);
        const previousBlock = await factomd.factoidBlock
            .load(factoidBlock.previousBlockKeyMR)
            .catch(handleBlockError);
        return previousBlock && { keyMR: previousBlock.keyMR };
    },
    nextBlock: async ({ keyMR }, _, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(keyMR!);
        const nextBlock = await factomd.factoidBlock
            .load(factoidBlock.directoryBlockHeight + 1)
            .catch(handleBlockError);
        return nextBlock && { keyMR: nextBlock.keyMR };
    },
    transactionPage: async (
        { keyMR },
        { offset = 0, first = MAX_PAGE_LENGTH },
        { factomd }
    ) => {
        testPaginationInput(offset!, first!);
        const factoidBlock = await factomd.factoidBlock.load(keyMR!);
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
                rcds: tx.rcds.map(rcd => rcd.toString('hex')),
                signatures: tx.signatures.map(signature => signature.toString('hex')),
                factoidBlock: { keyMR }
            })) as Transaction[];
        return {
            transactions,
            totalCount: factoidBlock.transactions.length,
            offset: offset as number,
            pageLength: transactions.length
        };
    },
    directoryBlock: async ({ keyMR }, _, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(keyMR!);
        const directoryBlock = await factomd.directoryBlock.load(
            factoidBlock.directoryBlockHeight
        );
        return { keyMR: directoryBlock.keyMR };
    }
};
