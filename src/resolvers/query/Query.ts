import { QueryResolvers } from '../../types/resolvers';

export const Query: QueryResolvers = {
    adminBlock: async (root, { arg }, { factomd }) => {
        const adminBlock = await factomd.adminBlock.load(arg);
        return {
            hash: adminBlock.lookupHash,
            height: adminBlock.directoryBlockHeight
        };
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
        const ack = await factomd.ack.load({ hash, chainid: 'c' });
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

    directoryBlock: async (root, { arg }, { factomd }) => {
        const { timestamp, height, keyMR } = await factomd.directoryBlock.load(arg);
        return { timestamp, height, hash: keyMR };
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

    entryAck: async (root, { hash, chain }, { factomd }) => {
        const ack = await factomd.ack.load({ hash, chainid: chain });
        return { commitHash: ack.committxid, entryHash: ack.entryhash };
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

    entryCreditBlock: async (root, { arg }, { factomd }) => {
        const entryCreditBlock = await factomd.entryCreditBlock.load(arg);
        return {
            hash: entryCreditBlock.headerHash,
            height: entryCreditBlock.directoryBlockHeight
        };
    },

    entryCreditBlockHead: async (root, args, { factomd }) => {
        const directoryBlockHead = await factomd.directoryBlockHead.load();
        const entryCreditBlockHead = await factomd.entryCreditBlock.load(
            directoryBlockHead.entryCreditBlockRef
        );
        return {
            hash: entryCreditBlockHead.headerHash,
            height: entryCreditBlockHead.directoryBlockHeight
        };
    },

    entryCreditRate: async (root, args, { factomd }) => {
        const { rate } = await factomd.entryCreditRate.load();
        return rate;
    },

    factoidBlock: async (root, { arg }, { factomd }) => {
        const factoidBlock = await factomd.factoidBlock.load(arg);
        return {
            hash: factoidBlock.keyMR,
            height: factoidBlock.directoryBlockHeight,
            entryCreditRate: factoidBlock.entryCreditRate
        };
    },

    factoidBlockHead: async (root, args, { factomd }) => {
        const directoryBlockHead = await factomd.directoryBlockHead.load();
        const factoidBlockHead = await factomd.factoidBlock.load(
            directoryBlockHead.factoidBlockRef
        );
        return {
            hash: factoidBlockHead.keyMR,
            height: factoidBlockHead.directoryBlockHeight,
            entryCreditRate: factoidBlockHead.entryCreditRate
        };
    }
};
