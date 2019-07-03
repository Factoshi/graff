import { QueryResolvers, EntryResolvers } from '../types/resolvers';
import { handleEntryError } from './resolver-helpers';

export const entryQueries: QueryResolvers = {
    entry: async (root, { hash }, { factomd }) => {
        const entry = await factomd.entry.load(hash).catch(handleEntryError);
        return entry && { hash: entry.hashHex() };
    }
};

export const entryResolvers: EntryResolvers = {
    chain: async ({ hash }, args, { factomd }) => {
        const entry = await factomd.entry.load(hash!).catch(handleEntryError);
        return entry && entry.chainIdHex;
    },
    timestamp: async ({ hash }, args, { factomd }) => {
        const entry = await factomd.entry.load(hash!).catch(handleEntryError);
        return entry && entry.timestamp;
    },
    externalIds: async ({ hash }, args, { factomd }) => {
        const entry = await factomd.entry.load(hash!).catch(handleEntryError);
        return entry && entry.extIds.map(id => id.toString('base64'));
    },
    content: async (parent, args, { factomd }) => {
        const entry = await factomd.entry.load(parent.hash!).catch(handleEntryError);
        return entry && entry.content.toString('base64');
    },

    entryBlock: async ({ hash }, args, { factomd }) => {
        const entry = await factomd.entry.load(hash!).catch(handleEntryError);
        return (
            entry && {
                hash: entry.blockContext.entryBlockKeyMR,
                timestamp: entry.blockContext.entryBlockTimestamp * 1000,
                height: entry.blockContext.entryBlockSequenceNumber
            }
        );
    }
};
