import { MutationResolvers } from '../types/resolvers';
import { MutationMethod } from '../contants';

export const mutation: MutationResolvers = {
    commitChain: (_, { commit }, { dataSources }) => {
        return dataSources.factomd.broadcastCommit(commit, MutationMethod.CommitChain);
    },
    commitEntry: (_, { commit }, { dataSources }) => {
        return dataSources.factomd.broadcastCommit(commit, MutationMethod.CommitEntry);
    },
    revealChain: (_, { reveal }, { dataSources }) => {
        return dataSources.factomd.broadcastReveal(reveal, MutationMethod.RevealChain);
    },
    revealEntry: (_, { reveal }, { dataSources }) => {
        return dataSources.factomd.broadcastReveal(reveal, MutationMethod.RevealEntry);
    },
    addChain: (_, args, { dataSources }) => {
        return dataSources.factomd.add(args, {
            commit: MutationMethod.CommitChain,
            reveal: MutationMethod.RevealChain
        });
    },
    addEntry: (_, args, { dataSources }) => {
        return dataSources.factomd.add(args, {
            commit: MutationMethod.CommitEntry,
            reveal: MutationMethod.RevealEntry
        });
    },
    submitTransaction: (_, { tx }, { dataSources }) => {
        return dataSources.factomd.submitTransaction(tx);
    }
};
