import { QueryResolvers, EntryResolvers } from '../types/resolvers';

export const handleEntryError = (error: Error) => {
    if (error.message.endsWith('Receipt creation error (code: -32010)')) {
        return null;
    } else {
        throw error;
    }
};

export const entryRootQueries: QueryResolvers = {
    entry: (root, { hash }) => ({ hash })
};

export const entryResolvers: EntryResolvers = {
    chain: ({ hash }, args, { factomd }) => {
        return factomd.entry
            .load(hash!)
            .then(entry => entry.chainIdHex)
            .catch(handleEntryError);
    },

    timestamp: ({ hash }, args, { factomd }) => {
        return factomd.entry
            .load(hash!)
            .then(entry => entry.timestamp)
            .catch(handleEntryError);
    },

    externalIds: ({ hash }, args, { factomd }) => {
        return factomd.entry
            .load(hash!)
            .then(entry => entry.extIds.map(id => id.toString('base64')))
            .catch(handleEntryError);
    },

    content: ({ hash }, args, { factomd }) => {
        return factomd.entry
            .load(hash!)
            .then(entry => entry.content.toString('base64'))
            .catch(handleEntryError);
    },

    block: ({ hash }, args, { factomd }) => {
        return factomd.entry
            .load(hash!)
            .then(entry => ({
                hash: entry.blockContext.entryBlockKeyMR,
                timestamp: entry.blockContext.entryBlockTimestamp * 1000,
                height: entry.blockContext.entryBlockSequenceNumber
            }))
            .catch(handleEntryError);
    }
};
