import {
    QueryResolvers,
    EntryCreditBlockResolvers,
    EntryCommit
} from '../types/resolvers';
import { testPaginationInput, handleBlockError } from './resolver-helpers';
import { MAX_PAGE_LENGTH } from '../contants';

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const entryCreditBlockQueries: QueryResolvers = {
    entryCreditBlock: async (_, { hash }, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock
            .load(hash)
            .catch(handleBlockError);
        return entryCreditBlock && { headerHash: entryCreditBlock.headerHash };
    },
    entryCreditBlockByHeight: async (_, { height }, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock
            .load(height!)
            .catch(handleBlockError);
        return entryCreditBlock && { headerHash: entryCreditBlock.headerHash };
    }
};

/**
 * AdminBlock type resolvers. All resolvers expect the parent to provide the headerHash.
 */
export const entryCreditBlockResolvers: EntryCreditBlockResolvers = {
    fullHash: async ({ headerHash }, _, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(headerHash!);
        return entryCreditBlock.fullHash;
    },
    bodyHash: async ({ headerHash }, _, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(headerHash!);
        return entryCreditBlock.bodyHash;
    },
    bodySize: async ({ headerHash }, _, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(headerHash!);
        return entryCreditBlock.bodySize;
    },
    objectCount: async ({ headerHash }, _, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(headerHash!);
        return entryCreditBlock.objectCount;
    },
    previousBlock: async ({ headerHash }, _, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(headerHash!);
        const previousBlock = await factomd.entryCreditBlock
            .load(entryCreditBlock.previousHeaderHash)
            .catch(handleBlockError);
        return previousBlock && { headerHash: previousBlock.headerHash };
    },
    nextBlock: async ({ headerHash }, _, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(headerHash!);
        const nextBlock = await factomd.entryCreditBlock
            .load(entryCreditBlock.directoryBlockHeight + 1)
            .catch(handleBlockError);
        return nextBlock && { headerHash: nextBlock.headerHash };
    },
    commitPage: async (
        { headerHash },
        { offset = 0, first = MAX_PAGE_LENGTH },
        { factomd }
    ) => {
        testPaginationInput(offset!, first!);
        const entryCreditBlock = await factomd.entryCreditBlock.load(headerHash!);
        const commits = entryCreditBlock.commits
            .slice(offset!, offset! + first!)
            .map(commit => ({
                timestamp: commit.millis,
                entry: { hash: commit.entryHash },
                credits: commit.credits,
                paymentAddress: commit.ecPublicKey,
                entryCreditBlock: { headerHash: headerHash },
                signature: commit.signature
            })) as EntryCommit[];
        return {
            commits,
            totalCount: entryCreditBlock.commits.length,
            offset: offset as number,
            pageLength: commits.length
        };
    },
    directoryBlock: async ({ headerHash }, _, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(headerHash!);
        const directoryBlock = await factomd.directoryBlock.load(
            entryCreditBlock.directoryBlockHeight
        );
        return { keyMR: directoryBlock.keyMR };
    }
};
