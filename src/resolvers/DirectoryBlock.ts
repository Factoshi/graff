import { DirectoryBlockResolvers, QueryResolvers, EntryBlock } from '../types/resolvers';
import { testPaginationInput, handleBlockError } from './resolver-helpers';
import { MAX_PAGE_LENGTH } from '../contants';

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const directoryBlockQueries: QueryResolvers = {
    directoryBlock: async (_, { hash }, { dataSources }) => {
        const directoryBlock = await dataSources.factomd
            .getDirectoryBlock(hash)
            .catch(handleBlockError);
        return directoryBlock && { keyMR: directoryBlock.keyMR };
    },
    directoryBlockByHeight: async (_, { height }, { dataSources }) => {
        const directoryBlock = await dataSources.factomd
            .getDirectoryBlock(height)
            .catch(handleBlockError);
        return directoryBlock && { keyMR: directoryBlock.keyMR };
    },
    directoryBlockHead: async (parent, args, { dataSources }) => {
        const directoryBlock = await dataSources.factomd.getDirectoryBlockHead();
        return { keyMR: directoryBlock.keyMR };
    }
};

/**
 * AdminBlock type resolvers.
 */
export const directoryBlockResolvers: DirectoryBlockResolvers = {
    adminBlock: async ({ keyMR }, _, { dataSources }) => {
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(keyMR!);
        // The adminBlockRef is the lookupHash, but the adminBlock resolvers are all expecting
        // the backReferencehash.
        const adminBlock = await dataSources.factomd.getAdminBlock(
            directoryBlock.adminBlockRef
        );
        return { backReferenceHash: adminBlock.backReferenceHash };
    },
    entryCreditBlock: async ({ keyMR }, _, { dataSources }) => {
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(keyMR!);
        return { headerHash: directoryBlock.entryCreditBlockRef };
    },
    entryBlockPage: async (
        { keyMR },
        { offset = 0, first = MAX_PAGE_LENGTH },
        { dataSources }
    ) => {
        testPaginationInput(offset!, first!);
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(keyMR!);
        const entryBlocks = directoryBlock.entryBlockRefs.slice(
            offset!,
            offset! + first!
        ) as EntryBlock[];
        return {
            entryBlocks,
            totalCount: directoryBlock.entryBlockRefs.length,
            offset: offset as number,
            pageLength: entryBlocks.length
        };
    },
    factoidBlock: async ({ keyMR }, _, { dataSources }) => {
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(keyMR!);
        return { keyMR: directoryBlock.factoidBlockRef };
    },
    height: async ({ keyMR }, _, { dataSources }) => {
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(keyMR!);
        return directoryBlock.height;
    },
    nextBlock: async ({ keyMR }, _, { dataSources }) => {
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(keyMR!);
        const nextBlock = await dataSources.factomd
            .getDirectoryBlock(directoryBlock.height + 1!)
            .catch(handleBlockError);
        return nextBlock && { keyMR: nextBlock.keyMR };
    },
    previousBlock: async ({ keyMR }, _, { dataSources }) => {
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(keyMR!);
        const previousBlock = await dataSources.factomd
            .getDirectoryBlock(directoryBlock.previousBlockKeyMR)
            .catch(handleBlockError);
        return previousBlock && { keyMR: previousBlock.keyMR };
    },
    timestamp: async ({ keyMR }, _, { dataSources }) => {
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(keyMR!);
        // convert to ms
        return directoryBlock!.timestamp * 1000;
    }
};
