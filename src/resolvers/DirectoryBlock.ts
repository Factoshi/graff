import { DirectoryBlockResolvers, QueryResolvers, EntryBlock } from '../types/resolvers';
import { testPaginationInput, handleBlockError } from './resolver-helpers';

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const directoryBlockQueries: QueryResolvers = {
    directoryBlock: async (root, { hash }, { dataSources }) => {
        console.time('fetch directory block');
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(hash);
        console.timeEnd('fetch directory block');
        return directoryBlock && { hash: directoryBlock.keyMR };
    },
    directoryBlockByHeight: async (root, { height }, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock
            .load(height)
            .catch(handleBlockError);
        return directoryBlock && { hash: directoryBlock.keyMR };
    },
    directoryBlockHead: async (root, args, { factomd, dataSources }) => {
        const directoryBlock = await factomd.directoryBlockHead.load();
        return { hash: directoryBlock.keyMR };
    }
};

/**
 * AdminBlock type resolvers.
 */
export const directoryBlockResolvers: DirectoryBlockResolvers = {
    adminBlock: async ({ hash }, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(hash!);
        return { hash: directoryBlock.adminBlockRef };
    },
    entryCreditBlock: async ({ hash }, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(hash!);
        return { hash: directoryBlock.entryCreditBlockRef };
    },
    entryBlocks: async ({ hash }, { offset = 0, first = Infinity }, { factomd }) => {
        testPaginationInput(offset!, first!);
        const directoryBlock = await factomd.directoryBlock.load(hash!);
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
            pageLength: entryBlocks.length
        };
    },
    factoidBlock: async ({ hash }, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(hash!);
        return { hash: directoryBlock.factoidBlockRef };
    },
    height: async ({ hash }, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(hash!);
        return directoryBlock.height;
    },
    nextBlock: async ({ hash }, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(hash!);
        const nextBlock = await factomd.directoryBlock
            .load(directoryBlock.height + 1)
            .catch(handleBlockError);
        return nextBlock && { hash: nextBlock.keyMR };
    },
    previousBlock: async ({ hash }, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(hash!);
        const previousBlock = await factomd.directoryBlock
            .load(directoryBlock.previousBlockKeyMR)
            .catch(handleBlockError);
        return previousBlock && { hash: previousBlock.keyMR };
    },
    timestamp: async ({ hash }, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlock.load(hash!);
        // convert to ms
        return directoryBlock.timestamp * 1000;
    }
};
