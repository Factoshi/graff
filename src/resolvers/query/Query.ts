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

    balances: async (root, { addresses }, { factomd }) => {
        const balances = await factomd.balance.loadMany(addresses);
        return balances.map((balance, i) => ({
            amount: balance,
            publicAddress: addresses[i]
        }));
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

    commitAck: async (root, { hash }, { factomd }) => {
        const ack = await factomd.commitAck.load(hash);
        return { commitHash: ack.committxid, entryHash: ack.entryhash };
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
    },

    directoryBlock: async (root, { hash }, { factomd }) => {
        const { timestamp, height } = await factomd.directoryBlock.load(hash);
        return { timestamp, height, hash };
    },

    directoryBlockByHeight: async (root, { height }, { factomd }) => {
        const { timestamp, keyMR: hash } = await factomd.directoryBlock.load(height);
        return { timestamp, height, hash };
    },

    directoryBlockHead: async (root, args, { factomd }) => {
        const {
            timestamp,
            keyMR: hash,
            height
        } = await factomd.directoryBlockHead.load();
        return { timestamp, height, hash };
    },

    entry: async (root, { hash }, { factomd }) => {
        const { chainIdHex, timestamp, extIds, content } = await factomd.entry.load(hash);
        return {
            hash,
            chain: chainIdHex,
            timestamp,
            externalIds: extIds.map(id => id.toString('base64')),
            content: content.toString('base64')
        };
    },

    entryBlock: async (root, { hash }, { factomd }) => {
        const {
            chainId: chain,
            timestamp,
            sequenceNumber: height
        } = await factomd.entryBlock.load(hash);
        return {
            hash,
            // convert to milliseconds
            timestamp: timestamp * 1000,
            chain,
            height
        };
    },

    entryAck: async (root, { hash, chain }, { factomd }) => {
        const ack = await factomd.entryAck.load({ hash, chainid: chain });
        return { commitHash: ack.committxid, entryHash: ack.entryhash };
    }
};
