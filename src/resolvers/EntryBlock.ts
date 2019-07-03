import { EntryBlockResolvers, QueryResolvers, Entry } from '../types/resolvers';
import {
    testPaginationInput,
    handleChainHeadError,
    handleBlockError
} from './resolver-helpers';

/**
 * Root Query resolvers that return a partial EntryBlock type.
 */
export const entryBlockQueries: QueryResolvers = {
    chainHead: async (root, { chain }, { factomd }) => {
        const chainHead = await factomd.chainHead.load(chain).catch(handleChainHeadError);
        return chainHead && { hash: chainHead.keyMR };
    },

    entryBlock: async (root, { hash }, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(hash).catch(handleBlockError);
        return entryBlock && { hash: entryBlock.keyMR };
    }
};

/**
 * EntryBlock type resolvers.
 */
export const entryBlockResolvers: EntryBlockResolvers = {
    previousBlock: async ({ hash }, args, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(hash!);
        const previousBlock = await factomd.entryBlock
            .load(entryBlock.previousBlockKeyMR)
            .catch(handleBlockError);
        return previousBlock && { hash: previousBlock.keyMR };
    },
    entries: async ({ hash }, { offset = 0, first = Infinity }, { factomd }) => {
        testPaginationInput(offset!, first!);
        const entryBlock = await factomd.entryBlock.load(hash!);
        const entries = entryBlock.entryRefs
            .slice(offset!, offset! + first!)
            .map(({ entryHash, timestamp }) => ({
                hash: entryHash,
                chain: entryBlock.chainId,
                // convert to milliseconds for consistency
                timestamp: timestamp * 1000,
                entryBlock: {
                    hash: entryBlock.keyMR,
                    chain: entryBlock.chainId,
                    timestamp: entryBlock.timestamp,
                    height: entryBlock.sequenceNumber
                }
            })) as Entry[];
        return {
            entries,
            totalCount: entryBlock.entryRefs.length,
            offset: offset as number,
            pageLength: entries.length
        };
    },
    directoryBlock: async ({ hash }, args, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(hash!);
        const directoryBlock = await factomd.directoryBlock.load(
            entryBlock.directoryBlockHeight
        );
        return { hash: directoryBlock.keyMR };
    },
    height: async ({ hash }, args, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(hash!);
        return entryBlock.sequenceNumber;
    },
    chain: async ({ hash }, args, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(hash!);
        return entryBlock.chainId;
    },
    timestamp: async ({ hash }, args, { factomd }) => {
        const entryBlock = await factomd.entryBlock.load(hash!);
        return entryBlock.timestamp;
    }
};
