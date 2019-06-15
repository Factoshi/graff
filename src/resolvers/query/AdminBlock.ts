import { AdminBlockResolvers, QueryResolvers } from '../../types/resolvers';
import { FactomdDataLoader } from '../../data_loader';
import { AdminBlock } from 'factom';

export const getAdminBlockLeaves = async (
    reference: string | number,
    factomd: FactomdDataLoader
) => {
    return factomd.adminBlock
        .load(reference)
        .then(extractAdminBlockLeaves)
        .catch(handleUnfound);
};

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
    adminBlock: async (parent, { arg }, { factomd }) => getAdminBlockLeaves(arg, factomd),

    adminBlockHead: async (root, args, { factomd }) => {
        const directoryBlockHead = await factomd.directoryBlockHead.load();
        return getAdminBlockLeaves(directoryBlockHead.adminBlockRef, factomd);
    }
};

/**
 * AdminBlock type resolvers.
 */
export const adminBlockResolvers: AdminBlockResolvers = {
    previousBlock: async (parent, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(parent.hash as string);
        return getAdminBlockLeaves(adminBlock.previousBackReferenceHash, factomd);
    },

    nextBlock: async (parent, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(parent.hash as string);
        return getAdminBlockLeaves(adminBlock.directoryBlockHeight + 1, factomd);
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
