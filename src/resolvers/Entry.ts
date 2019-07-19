import { QueryResolvers, EntryResolvers } from '../types/resolvers';
import { handleEntryError } from './resolver-helpers';

const resolveField = (field: string) => {
    return async ({ hash }: any, _: any, { dataSources }: any) => {
        const entry = await dataSources.factomd.getEntry(hash!).catch(handleEntryError);
        return entry && entry[field];
    };
};

export const entryQueries: QueryResolvers = {
    entry: async (_, { hash }, { dataSources }) => {
        const entry = await dataSources.factomd.getEntry(hash).catch(handleEntryError);
        return entry && { hash: entry.hash };
    }
};

export const entryResolvers: EntryResolvers = {
    chainId: resolveField('chainId'),
    timestamp: resolveField('timestamp'),
    externalIds: resolveField('extIds'),
    content: resolveField('content'),
    entryBlock: async ({ hash }, _, { dataSources }) => {
        const entry = await dataSources.factomd.getEntry(hash!).catch(handleEntryError);
        return entry && { keyMR: entry.blockContext.entryBlockKeyMR };
    }
};
