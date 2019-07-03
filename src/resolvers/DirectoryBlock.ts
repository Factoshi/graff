import { DirectoryBlockResolvers, QueryResolvers, EntryBlock } from '../types/resolvers';
import { DirectoryBlock } from 'factom';
import { handleBlockApiError, testPaginationInput } from './resolver-helpers';

export const extractDirectoryBlockLeaves = (directoryBlock: DirectoryBlock) => ({
    hash: directoryBlock.keyMR,
    height: directoryBlock.height,
    timestamp: directoryBlock.timestamp
});

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const directoryBlockQueries: QueryResolvers = {
    directoryBlock: (root, { hash }, { factomd }) => ({ hash }),

    directoryBlockByHeight: async (root, { height }, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(height);
        return { hash: directoryBlock.keyMR };
    },

    directoryBlockHead: async (root, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlockHead.load();
        return { hash: directoryBlock.keyMR };
    }
};

/**
 * AdminBlock type resolvers.
 */
export const directoryBlockResolvers: DirectoryBlockResolvers = {
    adminBlock: async (parent, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(parent.hash as string);
        return { height: directoryBlock.height, hash: directoryBlock.adminBlockRef };
    },

    entryCreditBlock: async (parent, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(parent.hash as string);
        return {
            height: directoryBlock.height,
            hash: directoryBlock.entryCreditBlockRef
        };
    },

    entryBlocks: async (parent, { offset = 0, first = Infinity }, { factomd }) => {
        testPaginationInput(offset!, first!);
        const directoryBlock = await factomd.directoryBlock.load(parent.hash as string);
        const entryBlocks = directoryBlock.entryBlockRefs
            .slice(offset!, offset! + first!)
            .map(({ chainId, keyMR }) => ({
                chain: chainId,
                hash: keyMR
            })) as EntryBlock[];
        return {
            entryBlocks,
            totalCount: directoryBlock.entryBlockRefs.length,
            offset: offset as number,
            pageLength: entryBlocks.length,
            finalPage:
                entryBlocks.length + offset! === directoryBlock.entryBlockRefs.length
        };
    },

    factoidBlock: async (parent, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(parent.hash as string);
        return { height: directoryBlock.height, hash: directoryBlock.factoidBlockRef };
    },

    nextBlock: async (parent, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(parent.hash as string);
        return factomd.directoryBlock
            .load(directoryBlock.height + 1)
            .then(extractDirectoryBlockLeaves)
            .catch(handleBlockApiError);
    },

    previousBlock: async (parent, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(parent.hash as string);
        return factomd.directoryBlock
            .load(directoryBlock.previousBlockKeyMR)
            .then(extractDirectoryBlockLeaves)
            .catch(handleBlockApiError);
    }
};
