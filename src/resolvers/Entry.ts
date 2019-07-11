import { QueryResolvers, EntryResolvers } from '../types/resolvers';
import { handleEntryError } from './resolver-helpers';

export const entryQueries: QueryResolvers = {
    entry: async (_, { hash }, { factomd }) => {
        const entry = await factomd.entry.load(hash).catch(handleEntryError);
        return entry && { hash: entry.hashHex() };
    }
};

export const entryResolvers: EntryResolvers = {
    chainId: async ({ hash }, _, { factomd }) => {
        const entry = await factomd.entry.load(hash!).catch(handleEntryError);
        return entry && entry.chainIdHex;
    },
    timestamp: async ({ hash }, _, { factomd }) => {
        const entry = await factomd.entry.load(hash!).catch(handleEntryError);
        return entry && entry.timestamp;
    },
    externalIds: async ({ hash }, _, { factomd }) => {
        const entry = await factomd.entry.load(hash!).catch(handleEntryError);
        return entry && entry.extIds.map(id => id.toString('base64'));
    },
    content: async (parent, _, { factomd }) => {
        const entry = await factomd.entry.load(parent.hash!).catch(handleEntryError);
        return entry && entry.content.toString('base64');
    },

    entryBlock: async ({ hash }, _, { factomd }) => {
        const entry = await factomd.entry.load(hash!).catch(handleEntryError);
        return entry && { keyMR: entry.blockContext.entryBlockKeyMR };
    }
};
