import { QueryResolvers, TransactionResolvers } from '../types/resolvers';

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const transactionQueries: QueryResolvers = {
    transaction: async (root, { hash }, { factomd }) => {
        const transaction = await factomd.transaction.load(hash);
        return { hash: transaction.id };
    }
};

export const transactionResolvers: TransactionResolvers = {
    timestamp: async ({ hash }, args, { factomd }) => {
        const transaction = await factomd.transaction.load(hash!);
        return transaction.timestamp;
    },
    inputs: async ({ hash }, args, { factomd }) => {
        const transaction = await factomd.transaction.load(hash!);
        return transaction.inputs;
    },
    factoidOutputs: async ({ hash }, args, { factomd }) => {
        const transaction = await factomd.transaction.load(hash!);
        return transaction.factoidOutputs;
    },
    entryCreditOutputs: async ({ hash }, args, { factomd }) => {
        const transaction = await factomd.transaction.load(hash!);
        return transaction.entryCreditOutputs;
    },
    totalInputs: async ({ hash }, args, { factomd }) => {
        const transaction = await factomd.transaction.load(hash!);
        return transaction.totalInputs;
    },
    totalFactoidOutputs: async ({ hash }, args, { factomd }) => {
        const transaction = await factomd.transaction.load(hash!);
        return transaction.totalFactoidOutputs;
    },
    totalEntryCreditOutputs: async ({ hash }, args, { factomd }) => {
        const transaction = await factomd.transaction.load(hash!);
        return transaction.totalEntryCreditOutputs;
    },
    fees: async ({ hash }, args, { factomd }) => {
        const transaction = await factomd.transaction.load(hash!);
        return transaction.feesPaid;
    },
    block: async ({ hash }, args, { factomd }) => {
        const transaction = await factomd.transaction.load(hash!);
        return { hash: transaction.blockContext.factoidBlockKeyMR };
    }
};
