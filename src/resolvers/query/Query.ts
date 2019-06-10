import { QueryResolvers } from '../../types/resolvers';

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
    },

    currentMinute: async (root, args, { factomd }) => {
        const currentMinute = await factomd.currentMinute.load();
        // All keys must be in camel case.
        return {
            leaderHeight: currentMinute.leaderheight,
            directoryBlockHeight: currentMinute.directoryblockheight,
            minute: currentMinute.minute,
            currentBlockStartTime: currentMinute.currentblockstarttime,
            currentMinuteStartTime: currentMinute.currentminutestarttime,
            currentTime: currentMinute.currenttime,
            directoryBlockInSeconds: currentMinute.directoryblockinseconds,
            stallDetected: currentMinute.stalldetected,
            faultTimeout: currentMinute.faulttimeout,
            roundTimeout: currentMinute.roundtimeout
        };
    }
};
