import { AdminBlockResolvers, QueryResolvers } from '../types/resolvers';
import { handleBlockError } from './resolver-helpers';
import factom = require('factom');

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const adminBlockQueries: QueryResolvers = {
    adminBlock: async (root, { hash }, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(hash).catch(handleBlockError);
        return adminBlock && { hash: adminBlock.backReferenceHash };
    },
    adminBlockByHeight: async (root, { height }, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(height).catch(handleBlockError);
        return adminBlock && { hash: adminBlock.backReferenceHash };
    },
    adminBlockHead: async (root, args, { factomd }) => {
        const directoryBlock = await factomd.directoryBlockHead.load();
        return { hash: directoryBlock.adminBlockRef };
    }
};

/**
 * AdminBlock type resolvers.
 */
export const adminBlockResolvers: AdminBlockResolvers = {
    previousBlock: async ({ hash }, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(hash!);
        const previousBlock = await factomd.adminBlock
            .load(adminBlock.previousBackReferenceHash)
            .catch(handleBlockError);
        return previousBlock && { hash: previousBlock.backReferenceHash };
    },
    nextBlock: async ({ hash }, args, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(hash!);
        const nextBlock = await factomd.adminBlock
            .load(adminBlock.directoryBlockHeight + 1)
            .catch(handleBlockError);
        return nextBlock && { hash: nextBlock.backReferenceHash };
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
