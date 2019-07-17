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
    chainHead: async (_, { chainId }, { dataSources }) => {
        const chainHead = await dataSources.factomd
            .getChainHead(chainId)
            .catch(handleChainHeadError);
        return chainHead && { keyMR: chainHead.keyMR };
    },
    entryBlock: async (_, { hash }, { dataSources }) => {
        const entryBlock = await dataSources.factomd
            .getEntryBlock(hash)
            .catch(handleBlockError);
        return entryBlock && { keyMR: entryBlock.keyMR };
    }
};

/**
 * EntryBlock type resolvers.
 */
export const entryBlockResolvers: EntryBlockResolvers = {
    previousBlock: async ({ keyMR }, _, { dataSources }) => {
        const entryBlock = await dataSources.factomd.getEntryBlock(keyMR!);
        const previousBlock = await dataSources.factomd
            .getEntryBlock(entryBlock.previousBlockKeyMR)
            .catch(handleBlockError);
        return previousBlock && { keyMR: previousBlock.keyMR };
    },
    entryPage: async (
        { keyMR },
        { offset = 0, first = MAX_PAGE_LENGTH },
        { dataSources }
    ) => {
        testPaginationInput(offset!, first!);
        const entryBlock = await dataSources.factomd.getEntryBlock(keyMR!);
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
    directoryBlock: async ({ keyMR }, _, { dataSources }) => {
        const entryBlock = await dataSources.factomd.getEntryBlock(keyMR!);
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(
            entryBlock.directoryBlockHeight
        );
        return { keyMR: directoryBlock.keyMR };
    },
    chainId: async ({ keyMR }, _, { dataSources }) => {
        const entryBlock = await dataSources.factomd.getEntryBlock(keyMR!);
        return entryBlock.chainId;
    },
    timestamp: async ({ keyMR }, _, { dataSources }) => {
        const entryBlock = await dataSources.factomd.getEntryBlock(keyMR!);
        return entryBlock.timestamp;
    },
    sequenceNumber: async ({ keyMR }, _, { dataSources }) => {
        const entryBlock = await dataSources.factomd.getEntryBlock(keyMR!);
        return entryBlock.sequenceNumber;
    }
};
