import { QueryResolvers, EntryResolvers } from '../types/resolvers';

export const entryRootQueries: QueryResolvers = {
    entry: (root, { hash }) => ({ hash })
};

export const entryResolvers: EntryResolvers = {
    chain: async ({ hash }, args, { factomd }) => {
        const { chainIdHex } = await factomd.entry.load(hash!);
        return chainIdHex;
    },

    timestamp: async ({ hash }, args, { factomd }) => {
        const { timestamp } = await factomd.entry.load(hash!);
        return timestamp;
    },

    externalIds: async ({ hash }, args, { factomd }) => {
        const { extIds } = await factomd.entry.load(hash!);
        return extIds.map(id => id.toString('base64'));
    },

    content: async ({ hash }, args, { factomd }) => {
        const { content } = await factomd.entry.load(hash!);
        return content.toString('base64');
    },

    block: async ({ hash }, args, { factomd }) => {
        const { blockContext } = await factomd.entry.load(hash!);
        return {
            hash: blockContext.entryBlockKeyMR,
            timestamp: blockContext.entryBlockTimestamp * 1000,
            height: blockContext.entryBlockSequenceNumber
        };
    }
};
