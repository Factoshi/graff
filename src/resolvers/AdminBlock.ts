import { AdminBlockResolvers, QueryResolvers } from '../types/resolvers';
import { handleBlockApiError } from './resolver-helpers';

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const adminBlockQueries: QueryResolvers = {
    adminBlock: async (root, { hash }, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(hash).catch(handleBlockApiError);
        return adminBlock && { hash: adminBlock.backReferenceHash };
    },
    adminBlockByHeight: async (root, { height }, { factomd }) => {
        const adminBlock = await factomd.adminBlock
            .load(height)
            .catch(handleBlockApiError);
        return adminBlock && { hash: adminBlock.backReferenceHash };
    },
    adminBlockHead: async (root, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlockHead
            .load()
            .catch(handleBlockApiError);
        return directoryBlock && { hash: directoryBlock.adminBlockRef };
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
