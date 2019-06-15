import { AdminBlockResolvers, QueryResolvers } from '../../types/resolvers';
import { FactomdDataLoader } from '../../data_loader';

export const getAdminBlockLeaves = async (
    reference: string | number,
    factomd: FactomdDataLoader
) => {
    const adminBlock = await factomd.adminBlock.load(reference);
    return {
        hash: adminBlock.backReferenceHash,
        height: adminBlock.directoryBlockHeight
};
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
export const AdminBlock: AdminBlockResolvers = {
    previousBlock: async (parent, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(parent.hash as string);
        return getAdminBlockLeaves(adminBlock.previousBackReferenceHash, factomd);
    },

};
