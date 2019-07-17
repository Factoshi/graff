import { handleTransactionError } from './resolver-helpers';
import { QueryResolvers, TransactionResolvers } from '../types/resolvers';

const resolveField = (field: string) => {
    return async ({ hash }: any, _: any, { dataSources }: any) => {
        const transaction = await dataSources.factomd.getTransaction(hash!);
        return transaction[field];
    };
};

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const transactionQueries: QueryResolvers = {
    transaction: async (root, { hash }, { dataSources }) => {
        const transaction = await dataSources.factomd
            .getTransaction(hash)
            .catch(handleTransactionError);
        return transaction && { hash: transaction.id };
    }
};

export const transactionResolvers: TransactionResolvers = {
    timestamp: resolveField('timestamp'),
    inputs: resolveField('inputs'),
    factoidOutputs: resolveField('factoidOutputs'),
    entryCreditOutputs: resolveField('entryCreditOutputs'),
    totalInputs: resolveField('totalInputs'),
    totalFactoidOutputs: resolveField('totalFactoidOutputs'),
    totalEntryCreditOutputs: resolveField('totalEntryCreditOutputs'),
    fees: resolveField('feesPaid'),
    rcds: resolveField('rcds'),
    signatures: resolveField('signatures'),
    factoidBlock: async ({ hash }, args, { dataSources }) => {
        const transaction = await dataSources.factomd.getTransaction(hash!);
        return { keyMR: transaction.blockContext.factoidBlockKeyMR };
    }
};
