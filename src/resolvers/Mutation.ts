import { MutationResolvers } from '../types/resolvers';

enum BroadcastMethod {
    CommitChain = 'commit-chain',
    RevealChain = 'reveal-chain',
    CommitEntry = 'commit-entry',
    RevealEntry = 'reveal-entry',
    SubmitTx = 'factoid-submit'
}

export const mutation: MutationResolvers = {
    commitChain: async (_, { commit }, { factomd }) => {
        const response = await factomd.cli.factomdApi(BroadcastMethod.CommitChain, {
            message: commit
        });
        return {
            entryHash: response.entryhash,
            transactionHash: response.txid,
            chainIdHash: response.chainidhash
        };
    },
    commitEntry: async (_, { commit }, { factomd }) => {
        const response = await factomd.cli.factomdApi(BroadcastMethod.CommitEntry, {
            message: commit
        });
        return {
            entryHash: response.entryhash,
            transactionHash: response.txid
        };
    },
    revealChain: async (_, { reveal }, { factomd }) => {
        const response = await factomd.cli.factomdApi(BroadcastMethod.RevealChain, {
            entry: reveal
        });
        return { entryHash: response.entryhash, chainId: response.chainid };
    },
    revealEntry: async (_, { reveal }, { factomd }) => {
        const response = await factomd.cli.factomdApi(BroadcastMethod.RevealEntry, {
            entry: reveal
        });
        return { entryHash: response.entryhash, chainId: response.chainid };
    }
};
