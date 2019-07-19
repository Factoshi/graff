import { QueryResolvers, FactoidBlockResolvers, Transaction } from '../types/resolvers';
import { testPaginationInput, handleBlockError } from './resolver-helpers';
import { MAX_PAGE_LENGTH } from '../contants';

const resolveField = (field: string) => {
    return async ({ keyMR }: any, _: any, { dataSources }: any) => {
        const factoidBlock = await dataSources.factomd.getFactoidBlock(keyMR!);
        return factoidBlock[field];
    };
};

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const factoidBlockQueries: QueryResolvers = {
    factoidBlock: async (_, { hash }, { dataSources }) => {
        const factoidBlock = await dataSources.factomd
            .getFactoidBlock(hash)
            .catch(handleBlockError);
        return factoidBlock && { keyMR: factoidBlock.keyMR };
    },
    factoidBlockByHeight: async (_, { height }, { dataSources }) => {
        const factoidBlock = await dataSources.factomd
            .getFactoidBlock(height)
            .catch(handleBlockError);
        return factoidBlock && { keyMR: factoidBlock.keyMR };
    }
};

export const factoidBlockResolvers: FactoidBlockResolvers = {
    bodyMR: resolveField('bodyMR'),
    ledgerKeyMR: resolveField('ledgerKeyMR'),
    entryCreditRate: resolveField('entryCreditRate'),
    previousBlock: async ({ keyMR }, _, { dataSources }) => {
        const factoidBlock = await dataSources.factomd.getFactoidBlock(keyMR!);
        const previousBlock = await dataSources.factomd
            .getFactoidBlock(factoidBlock.previousBlockKeyMR)
            .catch(handleBlockError);
        return previousBlock && { keyMR: previousBlock.keyMR };
    },
    nextBlock: async ({ keyMR }, _, { dataSources }) => {
        const factoidBlock = await dataSources.factomd.getFactoidBlock(keyMR!);
        const nextBlock = await dataSources.factomd
            .getFactoidBlock(factoidBlock.directoryBlockHeight + 1)
            .catch(handleBlockError);
        return nextBlock && { keyMR: nextBlock.keyMR };
    },
    transactionPage: async (
        { keyMR },
        { offset = 0, first = MAX_PAGE_LENGTH },
        { dataSources }
    ) => {
        testPaginationInput(offset!, first!);
        const factoidBlock = await dataSources.factomd.getFactoidBlock(keyMR!);
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
    directoryBlock: async ({ keyMR }, _, { dataSources }) => {
        const factoidBlock = await dataSources.factomd.getFactoidBlock(keyMR!);
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(
            factoidBlock.directoryBlockHeight
        );
        return { keyMR: directoryBlock.keyMR };
    }
};
