import { QueryResolvers, EntryCreditBlockResolvers, Commit } from '../types/resolvers';
import { testPaginationInput, handleBlockError } from './resolver-helpers';

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const entryCreditBlockQueries: QueryResolvers = {
    entryCreditBlock: async (root, { hash }, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock
            .load(hash)
            .catch(handleBlockError);
        return entryCreditBlock && { hash: entryCreditBlock.headerHash };
    },

    entryCreditBlockByHeight: async (root, { height }, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock
            .load(height!)
            .catch(handleBlockError);
        return entryCreditBlock && { hash: entryCreditBlock.headerHash };
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
        const previousBlock = await factomd.entryCreditBlock
            .load(entryCreditBlock.previousHeaderHash)
            .catch(handleBlockError);
        return previousBlock && { hash: previousBlock.headerHash };
    },
    nextBlock: async ({ hash }, args, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(hash!);
        const nextBlock = await factomd.entryCreditBlock
            .load(entryCreditBlock.directoryBlockHeight + 1)
            .catch(handleBlockError);
        return nextBlock && { hash: nextBlock.headerHash };
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
            pageLength: commits.length
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
