import { QueryResolvers, EntryResolvers } from '../types/resolvers';

export const handleEntryError = (error: Error) => {
    if (error.message.endsWith('Receipt creation error (code: -32010)')) {
        return null;
    } else {
        throw error;
    }
};

export const entryQueries: QueryResolvers = {
    entry: (root, { hash }) => ({ hash })
};

export const entryResolvers: EntryResolvers = {
    chain: async ({ hash }, args, { factomd }) => {
        const entry = await factomd.entry.load(hash!);
        return entry.chainIdHex;
    },
    timestamp: async ({ hash }, args, { factomd }) => {
        const entry = await factomd.entry.load(hash!);
        return entry.timestamp;
    },
    externalIds: async ({ hash }, args, { factomd }) => {
        const entry = await factomd.entry.load(hash!);
        return entry.extIds.map(id => id.toString('base64'));
    },
    content: async ({ hash }, args, { factomd }) => {
        const entry = await factomd.entry.load(hash!);
        return entry.content.toString('base64');
    },

    entryBlock: async ({ hash }, args, { factomd }) => {
        const entry = await factomd.entry.load(hash!);
        return {
            hash: entry.blockContext.entryBlockKeyMR,
            timestamp: entry.blockContext.entryBlockTimestamp * 1000,
            height: entry.blockContext.entryBlockSequenceNumber
        };
    }
};
