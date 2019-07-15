import { EntryBlockResolvers, QueryResolvers, Entry } from '../types/resolvers';
import {
    testPaginationInput,
    handleChainHeadError,
    handleBlockError
} from './resolver-helpers';
import { MAX_PAGE_LENGTH } from '../contants';

/**
 * Root Query resolvers that return a partial EntryBlock type.
 */
export const entryBlockQueries: QueryResolvers = {
    chainHead: async (_, { chainId }, { factomd }) => {
        const chainHead = await factomd.chainHead
            .load(chainId)
            .catch(handleChainHeadError);
        return chainHead && { keyMR: chainHead.keyMR };
    },
    entryBlock: async (_, { hash }, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(hash).catch(handleBlockError);
        return entryBlock && { keyMR: entryBlock.keyMR };
    }
};

/**
 * EntryBlock type resolvers.
 */
export const entryBlockResolvers: EntryBlockResolvers = {
    previousBlock: async ({ keyMR }, _, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(keyMR!);
        const previousBlock = await factomd.entryBlock
            .load(entryBlock.previousBlockKeyMR)
            .catch(handleBlockError);
        return previousBlock && { keyMR: previousBlock.keyMR };
    },
    entryPage: async (
        { keyMR },
        { offset = 0, first = MAX_PAGE_LENGTH },
        { factomd }
    ) => {
        testPaginationInput(offset!, first!);
        const entryBlock = await factomd.entryBlock.load(keyMR!);
        const entries = entryBlock.entryRefs
            .slice(offset!, offset! + first!)
            .map(({ entryHash, timestamp }) => ({
                hash: entryHash,
                chainId: entryBlock.chainId,
                timestamp: timestamp * 1000, // convert to milliseconds for consistency
                entryBlock: { keyMR: entryBlock.keyMR }
            })) as Entry[];
        return {
            entries,
            totalCount: entryBlock.entryRefs.length,
            offset: offset as number,
            pageLength: entries.length
        };
    },
    directoryBlock: async ({ keyMR }, _, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(keyMR!);
        const directoryBlock = await factomd.directoryBlock.load(
            entryBlock.directoryBlockHeight
        );
        return { keyMR: directoryBlock.keyMR };
    },
    chainId: async ({ keyMR }, _, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(keyMR!);
        return entryBlock.chainId;
    },
    timestamp: async ({ keyMR }, _, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(keyMR!);
        return entryBlock.timestamp;
    },
    sequenceNumber: async ({ keyMR }, _, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(keyMR!);
        return entryBlock.sequenceNumber;
    }
};
