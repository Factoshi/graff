import { QueryResolvers, EntryResolvers } from '../types/resolvers';
import { handleEntryError } from './resolver-helpers';

export const entryQueries: QueryResolvers = {
    entry: async (_, { hash }, { dataSources }) => {
        const entry = await dataSources.factomd.getEntry(hash).catch(handleEntryError);
        return entry && { hash: entry.hash };
    }
};

export const entryResolvers: EntryResolvers = {
    chainId: async ({ hash }, _, { dataSources }) => {
        const entry = await dataSources.factomd.getEntry(hash!).catch(handleEntryError);
        return entry && entry.chainId;
    },
    timestamp: async ({ hash }, _, { dataSources }) => {
        const entry = await dataSources.factomd.getEntry(hash!).catch(handleEntryError);
        return entry && entry.timestamp;
    },
    externalIds: async ({ hash }, _, { dataSources }) => {
        const entry = await dataSources.factomd.getEntry(hash!).catch(handleEntryError);
        return entry && entry.extIds;
    },
    content: async (parent, _, { dataSources }) => {
        const entry = await dataSources.factomd
            .getEntry(parent.hash!)
            .catch(handleEntryError);
        return entry && entry.content;
    },
    entryBlock: async ({ hash }, _, { dataSources }) => {
        const entry = await dataSources.factomd.getEntry(hash!).catch(handleEntryError);
        return entry && { keyMR: entry.blockContext.entryBlockKeyMR };
    }
};
