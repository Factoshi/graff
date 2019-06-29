import { QueryResolvers, EntryCreditBlockResolvers, Commit } from '../types/resolvers';
import { testPaginationInput, handleBlockApiError } from './resolver-helpers';

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const entryCreditBlockRootQueries: QueryResolvers = {
    entryCreditBlock: async (root, { arg }, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(arg);
        return {
            hash: entryCreditBlock.headerHash,
            height: entryCreditBlock.directoryBlockHeight
        };
    },
    entryCreditBlockHead: async (root, args, { factomd }) => {
        const directoryBlockHead = await factomd.directoryBlockHead.load();
        return { hash: directoryBlockHead.entryCreditBlockRef };
    }
};

/**
 * AdminBlock type resolvers.
 */
export const entryCreditBlockResolvers: EntryCreditBlockResolvers = {
    height: async ({ hash }, args, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(hash!);
        return entryCreditBlock.directoryBlockHeight;
    },
    previousBlock: async ({ hash }, args, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(hash!);
        return { hash: entryCreditBlock.previousHeaderHash };
    },
    nextBlock: async ({ hash }, args, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(hash!);
        return factomd.entryCreditBlock
            .load(entryCreditBlock.directoryBlockHeight + 1)
            .then(nextBlock => ({ hash: nextBlock.headerHash }))
            .catch(handleBlockApiError);
    },
    commits: async ({ hash }, { offset = 0, first = Infinity }, { factomd }) => {
        testPaginationInput(offset!, first!);
        const entryCreditBlock = await factomd.entryCreditBlock.load(hash!);
        const commits = entryCreditBlock.commits
            .slice(offset!, offset! + first!)
            .map(commit => ({
                timestamp: commit.millis,
                entry: { hash: commit.entryHash },
                credits: commit.credits,
                paymentAddress: commit.ecPublicKey,
                block: { hash }
            })) as Commit[];
        return {
            commits,
            totalCount: entryCreditBlock.commits.length,
            offset: offset as number,
            pageLength: commits.length,
            finalPage: commits.length + offset! === entryCreditBlock.commits.length
        };
    },
    directoryBlock: async ({ hash }, args, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(hash!);
        const directoryBlock = await factomd.directoryBlock.load(
            entryCreditBlock.directoryBlockHeight
        );
        return { hash: directoryBlock.keyMR };
    }
};
