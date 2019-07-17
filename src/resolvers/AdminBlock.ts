import { AdminBlockResolvers, QueryResolvers } from '../types/resolvers';
import { handleBlockError } from './resolver-helpers';
import { FactomdDataSource } from '../dataSource';

const getBackRefHash = (factomd: FactomdDataSource, query: string | number) =>
    factomd
        .getAdminBlock(query)
        .then(aBlock => aBlock && { backReferenceHash: aBlock.backReferenceHash })
        .catch(handleBlockError);

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const adminBlockQueries: QueryResolvers = {
    adminBlock(_, { hash }, { dataSources }) {
        return getBackRefHash(dataSources.factomd, hash);
    },
    adminBlockByHeight(_, { height }, { dataSources }) {
        return getBackRefHash(dataSources.factomd, height);
    }
};

/**
 * AdminBlock type resolvers. All resolvers expect the parent to provide the backReferenceHash.
 */
export const adminBlockResolvers: AdminBlockResolvers = {
    previousBlock: async ({ backReferenceHash }, _, { dataSources }) => {
        const adminBlock = await dataSources.factomd.getAdminBlock(backReferenceHash!);
        const previousBlock = await dataSources.factomd
            .getAdminBlock(adminBlock.previousBackReferenceHash)
            .catch(handleBlockError);
        return previousBlock && { backReferenceHash: previousBlock.backReferenceHash };
    },
    nextBlock: async ({ backReferenceHash }, _, { dataSources }) => {
        const adminBlock = await dataSources.factomd.getAdminBlock(backReferenceHash!);
        const nextBlock = await dataSources.factomd
            .getAdminBlock(adminBlock.directoryBlockHeight + 1)
            .catch(handleBlockError);
        return nextBlock && { backReferenceHash: nextBlock.backReferenceHash };
    },
    entries: async ({ backReferenceHash }, _, { dataSources }) => {
        const adminBlock = await dataSources.factomd.getAdminBlock(backReferenceHash!);
        // Return each entry with renamed adminId and adminCode
        return adminBlock.entries.map((entry: any) => {
            const { adminId: id, adminCode: code, ...rest } = entry;
            return { id, code, ...rest };
        });
    },
    directoryBlock: async ({ backReferenceHash }, _, { dataSources }) => {
        const adminBlock = await dataSources.factomd.getAdminBlock(backReferenceHash!);
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(
            adminBlock.directoryBlockHeight
        );
        return { keyMR: directoryBlock.keyMR };
    },
    lookupHash: async ({ backReferenceHash }, _, { dataSources }) => {
        const adminBlock = await dataSources.factomd.getAdminBlock(backReferenceHash!);
        return adminBlock.lookupHash;
    },
    bodySize: async ({ backReferenceHash }, _, { dataSources }) => {
        const adminBlock = await dataSources.factomd.getAdminBlock(backReferenceHash!);
        return adminBlock.bodySize;
    }
};
