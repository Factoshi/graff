import { MutationResolvers } from '../types/resolvers';
import { FactomdDataLoader } from '../data_loader';

enum BroadcastMethod {
    CommitChain = 'commit-chain',
    RevealChain = 'reveal-chain',
    CommitEntry = 'commit-entry',
    RevealEntry = 'reveal-entry',
    SubmitTx = 'factoid-submit'
}

const broadcastCommit = async (
    factomd: FactomdDataLoader,
    commit: string,
    method: BroadcastMethod
) =>
    factomd.cli.factomdApi(method, { message: commit }).then(res => ({
        entryHash: res.entryhash,
        transactionHash: res.txid,
        chainIdHash: res.chainidhash || null
    }));

const broadcastReveal = async (
    factomd: FactomdDataLoader,
    reveal: string,
    method: BroadcastMethod
) =>
    factomd.cli.factomdApi(method, { entry: reveal }).then(res => ({
        entryHash: res.entryhash,
        chainId: res.chainid
    }));

const add = async (
    factomd: FactomdDataLoader,
    payload: { commit: string; reveal: string },
    methods: { commit: BroadcastMethod; reveal: BroadcastMethod }
) => {
    const commitRes = await broadcastCommit(factomd, payload.commit, methods.commit);
    const status = await factomd.cli.waitOnCommitAck(commitRes.transactionHash, 60);
    if (status !== 'TransactionACK') {
        throw new Error('Commit acknowledgement timed out.');
    }
    return broadcastReveal(factomd, payload.reveal, methods.reveal);
};

export const mutation: MutationResolvers = {
    commitChain: (_, { commit }, { factomd }) => {
        return broadcastCommit(factomd, commit, BroadcastMethod.CommitChain);
    },
    commitEntry: (_, { commit }, { factomd }) => {
        return broadcastCommit(factomd, commit, BroadcastMethod.CommitEntry);
    },
    revealChain: (_, { reveal }, { factomd }) => {
        return broadcastReveal(factomd, reveal, BroadcastMethod.RevealChain);
    },
    revealEntry: (_, { reveal }, { factomd }) => {
        return broadcastReveal(factomd, reveal, BroadcastMethod.RevealEntry);
    },
    addChain: (_, args, { factomd }) => {
        return add(factomd, args, {
            commit: BroadcastMethod.CommitChain,
            reveal: BroadcastMethod.RevealChain
        });
    },
    addEntry: (_, args, { factomd }) => {
        return add(factomd, args, {
            commit: BroadcastMethod.CommitChain,
            reveal: BroadcastMethod.RevealChain
        });
    }
};
