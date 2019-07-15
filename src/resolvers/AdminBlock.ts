import { AdminBlockResolvers, QueryResolvers } from '../types/resolvers';
import { handleBlockError } from './resolver-helpers';

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const adminBlockQueries: QueryResolvers = {
    adminBlock: async (_, { hash }, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(hash).catch(handleBlockError);
        return adminBlock && { backReferenceHash: adminBlock.backReferenceHash };
    },
    adminBlockByHeight: async (_, { height }, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(height).catch(handleBlockError);
        return adminBlock && { backReferenceHash: adminBlock.backReferenceHash };
    }
};

/**
 * AdminBlock type resolvers. All resolvers expect the parent to provide the backReferenceHash.
 */
export const adminBlockResolvers: AdminBlockResolvers = {
    previousBlock: async ({ backReferenceHash }, _, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(backReferenceHash!);
        const previousBlock = await factomd.adminBlock
            .load(adminBlock.previousBackReferenceHash)
            .catch(handleBlockError);
        return previousBlock && { backReferenceHash: previousBlock.backReferenceHash };
    },
    nextBlock: async ({ backReferenceHash }, _, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(backReferenceHash!);
        const nextBlock = await factomd.adminBlock
            .load(adminBlock.directoryBlockHeight + 1)
            .catch(handleBlockError);
        return nextBlock && { backReferenceHash: nextBlock.backReferenceHash };
    },
    entries: async ({ backReferenceHash }, _, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(backReferenceHash!);
        // Return each entry with renamed adminId and adminCode
        return adminBlock.entries.map((entry: any) => {
            const { adminId: id, adminCode: code, ...rest } = entry;
            return { id, code, ...rest };
        });
    },
    directoryBlock: async ({ backReferenceHash }, _, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(backReferenceHash!);
        const directoryBlock = await factomd.directoryBlock.load(
            adminBlock.directoryBlockHeight
        );
        return { keyMR: directoryBlock.keyMR };
    },
    lookupHash: async ({ backReferenceHash }, _, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(backReferenceHash!);
        return adminBlock.lookupHash;
    },
    bodySize: async ({ backReferenceHash }, _, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(backReferenceHash!);
        return adminBlock.bodySize;
    }
};
