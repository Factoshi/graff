import { AdminBlockResolvers, QueryResolvers } from '../../types/resolvers';
import { FactomdDataLoader } from '../../data_loader';
import { AdminBlock } from 'factom';

export const extractAdminBlockLeaves = (adminBlock: AdminBlock) => ({
    hash: adminBlock.backReferenceHash,
    height: adminBlock.directoryBlockHeight
});

export const handleUnfound = (error: Error) => {
    if (error.message.endsWith('Block not found (code: -32008)')) {
        return null;
    } else {
        throw error;
    }
};

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const adminBlockRootQueries: QueryResolvers = {
    adminBlock: (parent, { arg }, { factomd }) => {
        return factomd.adminBlock
            .load(arg)
            .then(extractAdminBlockLeaves)
            .catch(handleUnfound);
    },

    adminBlockHead: async (root, args, { factomd }) => {
        const directoryBlockHead = await factomd.directoryBlockHead.load();
        return factomd.adminBlock
            .load(directoryBlockHead.adminBlockRef)
            .then(extractAdminBlockLeaves)
            .catch(handleUnfound);
    }
};

/**
 * AdminBlock type resolvers.
 */
export const adminBlockResolvers: AdminBlockResolvers = {
    previousBlock: async (parent, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(parent.hash as string);
        return factomd.adminBlock
            .load(adminBlock.previousBackReferenceHash)
            .then(extractAdminBlockLeaves)
            .catch(handleUnfound);
    },

    nextBlock: async (parent, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(parent.hash as string);
        return factomd.adminBlock
            .load(adminBlock.directoryBlockHeight + 1)
            .then(extractAdminBlockLeaves)
            .catch(handleUnfound);
    },

    entries: async (parent, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(parent.hash as string);
        // Return each entry with renamed adminId and adminCode
        return adminBlock.entries.map((entry: any) => {
            const { adminId: id, adminCode: code, ...rest } = entry;
            return { id, code, ...rest };
        });
    },

    directoryBlock: async (parent, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(parent.hash as string);
        return { height: adminBlock.directoryBlockHeight };
    }
};
