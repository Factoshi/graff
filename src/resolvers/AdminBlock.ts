import { AdminBlockResolvers, QueryResolvers } from '../types/resolvers';
import { AdminBlock } from 'factom';
import { handleBlockApiError } from './resolver-helpers';

export const extractAdminBlockLeaves = (adminBlock: AdminBlock) => ({
    hash: adminBlock.backReferenceHash,
    height: adminBlock.directoryBlockHeight
});

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const adminBlockRootQueries: QueryResolvers = {
    adminBlock: (parent, { arg }, { factomd }) => {
        return factomd.adminBlock
            .load(arg)
            .then(extractAdminBlockLeaves)
            .catch(handleBlockApiError);
    },

    adminBlockHead: async (root, args, { factomd }) => {
        const directoryBlockHead = await factomd.directoryBlockHead.load();
        return factomd.adminBlock
            .load(directoryBlockHead.adminBlockRef)
            .then(extractAdminBlockLeaves)
            .catch(handleBlockApiError);
    }
};

/**
 * AdminBlock type resolvers.
 */
export const adminBlockResolvers: AdminBlockResolvers = {
    previousBlock: async ({ hash }, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(hash!);
        return { hash: adminBlock.previousBackReferenceHash };
    },
    nextBlock: async ({ hash }, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(hash!);
        const nextBlock = await factomd.adminBlock.load(
            adminBlock.directoryBlockHeight + 1
        );
        return { hash: nextBlock.backReferenceHash };
    },
    entries: async ({ hash }, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(hash!);
        // Return each entry with renamed adminId and adminCode
        return adminBlock.entries.map((entry: any) => {
            const { adminId: id, adminCode: code, ...rest } = entry;
            return { id, code, ...rest };
        });
    },
    directoryBlock: async ({ hash }, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(hash!);
        const directoryBlock = await factomd.directoryBlock.load(
            adminBlock.directoryBlockHeight
        );
        return { hash: directoryBlock.keyMR };
    },
    height: async ({ hash }, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(hash!);
        return adminBlock.directoryBlockHeight;
    }
};
