import { QueryResolvers } from '../../types/resolvers';
import { FactomdDataLoader } from '../../data_loader';

export const Query: QueryResolvers = {
    adminBlock: (_, { hash }) => ({ hash }),

    adminBlockByHeight: async (root, { height }, { factomd }) => {
        const admimBlock = await factomd.adminBlock.load(height);
        return { hash: admimBlock.lookupHash };
    },

    adminBlockHead: async (root, args, { factomd }) => {
        const directoryBlockHead = await factomd.directoryBlockHead.load();
        const adminBlock = await factomd.adminBlock.load(
            directoryBlockHead.adminBlockRef
        );
        return { hash: adminBlock.lookupHash };
    },

    chainHead: async (root, { chain }, { factomd }) => {
        const chainHead = await factomd.chainHead.load(chain);
        const entryBlock = await factomd.entryBlock.load(chainHead.keyMR);
        return {
            hash: entryBlock.keyMR,
            chain,
            height: entryBlock.sequenceNumber
        };
    }
};
