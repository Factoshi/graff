import { DirectoryBlockResolvers, QueryResolvers, EntryBlock } from '../types/resolvers';
import { testPaginationInput, handleBlockError } from './resolver-helpers';

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const directoryBlockQueries: QueryResolvers = {
    directoryBlock: async (_, { hash }, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock
            .load(hash)
            .catch(handleBlockError);
        return directoryBlock && { keyMR: directoryBlock.keyMR };
    },
    directoryBlockByHeight: async (_, { height }, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock
            .load(height)
            .catch(handleBlockError);
        return directoryBlock && { keyMR: directoryBlock.keyMR };
    },
    directoryBlockHead: async (parent, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlockHead.load();
        return { keyMR: directoryBlock.keyMR };
    }
};

/**
 * AdminBlock type resolvers.
 */
export const directoryBlockResolvers: DirectoryBlockResolvers = {
    adminBlock: async ({ keyMR }, _, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(keyMR!);
        // The adminBlockRef is the lookupHash, but the adminBlock resolvers are all expecting
        // the backReferencehash.
        const adminBlock = await factomd.adminBlock.load(directoryBlock.adminBlockRef);
        return { backReferenceHash: adminBlock.backReferenceHash };
    },
    entryCreditBlock: async ({ keyMR }, _, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(keyMR!);
        return { headerHash: directoryBlock.entryCreditBlockRef };
    },
    entryBlockPage: async ({ keyMR }, { offset = 0, first = Infinity }, { factomd }) => {
        testPaginationInput(offset!, first!);
        const directoryBlock = await factomd.directoryBlock.load(keyMR!);
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
    factoidBlock: async ({ keyMR }, _, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(keyMR!);
        return { keyMR: directoryBlock.factoidBlockRef };
    },
    height: async ({ keyMR }, _, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(keyMR!);
        return directoryBlock.height;
    },
    nextBlock: async ({ keyMR }, _, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(keyMR!);
        const nextBlock = await factomd.directoryBlock
            .load(directoryBlock.height + 1)
            .catch(handleBlockError);
        return nextBlock && { keyMR: nextBlock.keyMR };
    },
    previousBlock: async ({ keyMR }, _, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(keyMR!);
        const previousBlock = await factomd.directoryBlock
            .load(directoryBlock.previousBlockKeyMR)
            .catch(handleBlockError);
        return previousBlock && { keyMR: previousBlock.keyMR };
    },
    timestamp: async ({ keyMR }, _, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(keyMR!);
        // convert to ms
        return directoryBlock.timestamp * 1000;
    }
};
