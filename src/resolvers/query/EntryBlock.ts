import { EntryBlockResolvers, QueryResolvers } from '../../types/resolvers';
import { EntryBlock } from 'factom';
import { handleBlockApiError } from '../helpers';

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
