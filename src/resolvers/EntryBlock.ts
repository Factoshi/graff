import { EntryBlockResolvers, QueryResolvers, Entry } from '../types/resolvers';
import { EntryBlock } from 'factom';
import { handleBlockApiError, testPaginationInput } from './resolver-helpers';

export const extractEntryBlockLeaves = (entryBlock: EntryBlock) => ({
    hash: entryBlock.keyMR,
    chain: entryBlock.chainId,
    height: entryBlock.sequenceNumber,
    timestamp: entryBlock.timestamp
});

/**
 * Root Query resolvers that return a partial EntryBlock type.
 */
export const entryBlockRootQueries: QueryResolvers = {
    chainHead: async (root, { chain }, { factomd }) => {
        const chainHead = await factomd.chainHead.load(chain);
        return factomd.entryBlock
            .load(chainHead.keyMR)
            .then(extractEntryBlockLeaves)
            .catch(handleBlockApiError);
    }
};

/**
 * EntryBlock type resolvers.
 */
export const entryBlockResolvers: EntryBlockResolvers = {
    previousBlock: async (parent, args, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(parent.hash as string);
        return factomd.entryBlock
            .load(entryBlock.previousBlockKeyMR)
            .then(extractEntryBlockLeaves)
            .catch(handleBlockApiError);
    },

    entries: async (parent, { offset = 0, first = Infinity }, { factomd }) => {
        testPaginationInput(offset!, first!);
        const entryBlock = await factomd.entryBlock.load(parent.hash as string);
        const entryBlockLeaves = extractEntryBlockLeaves(entryBlock);
        const entries = entryBlock.entryRefs
            .slice(offset!, offset! + first!)
            .map(({ entryHash, timestamp }) => ({
                hash: entryHash,
                chain: entryBlock.chainId,
                // convert to milliseconds for consistency
                timestamp: timestamp * 1000,
                block: entryBlockLeaves
            })) as Entry[];
        return {
            entries,
            totalCount: entryBlock.entryRefs.length,
            offset: offset as number,
            pageLength: entries.length,
            finalPage: entries.length + offset! === entryBlock.entryRefs.length
        };
    },

    directoryBlock: async (parent, args, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(parent.hash as string);
        return { height: entryBlock.directoryBlockHeight };
    }
};
