import {
    SubscriptionResolvers,
    Transaction,
    FactoidBlock,
    EntryBlock,
    DirectoryBlock
} from '../types/resolvers';
import { factomEmitter, factomCli } from '../connect';
import { PubSub } from 'apollo-server';
import { Channel } from '../contants';
import Factom from 'factom';
import bluebird from 'bluebird';
import { PublishParams } from '../types/server';
import { compose } from 'ramda';

const pubsub = new PubSub();
const publish = ({ channel, payload }: PublishParams) => pubsub.publish(channel, payload);

/******************************
 *  Publish Protocol Blocks   *
 ******************************/

const directoryBlockParams = ({ keyMR }: Factom.DirectoryBlock): PublishParams => ({
    channel: Channel.NewDirectoryBlock,
    payload: { newDirectoryBlock: { keyMR } }
});

const entryCreditBlockParams = ({ entryCreditBlockRef }: Factom.DirectoryBlock) => ({
    channel: Channel.NewEntryCreditBlock,
    payload: { newEntryCreditBlock: { headerHash: entryCreditBlockRef } }
});

const factoidBlockParams = ({ factoidBlockRef }: Factom.DirectoryBlock) => ({
    channel: Channel.NewFactoidBlock,
    payload: { newFactoidBlock: { keyMR: factoidBlockRef } }
});

const adminBlockParams = async ({ adminBlockRef }: Factom.DirectoryBlock) => {
    const adminBlock = await factomCli.getAdminBlock(adminBlockRef);
    return {
        channel: Channel.NewAdminBlock,
        payload: { newAdminBlock: { backReferenceHash: adminBlock.backReferenceHash } }
    };
};

/**************************
 *  Publish Tranactions   *
 **************************/

const formatTransaction = (tx: Factom.Transaction): Transaction => ({
    hash: tx.id,
    timestamp: tx.timestamp,
    inputs: tx.inputs,
    factoidOutputs: tx.factoidOutputs,
    entryCreditOutputs: tx.entryCreditOutputs,
    totalInputs: tx.totalInputs,
    totalFactoidOutputs: tx.totalFactoidOutputs,
    totalEntryCreditOutputs: tx.totalEntryCreditOutputs,
    fees: tx.feesPaid,
    rcds: tx.rcds.map(rcd => rcd.toString('hex')),
    signatures: tx.signatures.map(s => s.toString('hex')),
    factoidBlock: { keyMR: tx.blockContext.factoidBlockKeyMR } as FactoidBlock
});

export const publishNewTransactions = (factoidBlock: Factom.FactoidBlock) => {
    for (let tx of factoidBlock.transactions) {
        const formattedTx = formatTransaction(tx);
        // Get a Set of all FCT addresses involved with this this transaction.
        const addrs = new Set([...tx.inputs, ...tx.factoidOutputs].map(io => io.address));
        // Publish the transaction to a channel for each of those addresses.
        addrs.forEach(addr =>
            publish({ channel: addr, payload: { newFactoidTransaction: formattedTx } })
        );
    }
};

/*******************************
 *  Publish New Entry Blocks   *
 *******************************/

export const publishNewEntryBlocks = (directoryBlock: Factom.DirectoryBlock) => {
    directoryBlock.entryBlockRefs.forEach(ref =>
        publish({ channel: ref.chainId, payload: { newEntryBlock: ref } })
    );
};

/*************************
 *  Publish New Chains   *
 *************************/

export const publishNewChains = async (directoryBlock: Factom.DirectoryBlock) => {
    const newChains: Partial<EntryBlock>[] = await bluebird
        .map(
            directoryBlock.entryBlockRefs,
            ({ keyMR }) => factomCli.getEntryBlock(keyMR),
            { concurrency: 5 }
        )
        .filter(entryBlock => entryBlock.sequenceNumber === 0)
        .map(entryBlock => ({
            keyMR: entryBlock.keyMR,
            previousBlock: null,
            chainId: entryBlock.chainId,
            sequenceNumber: entryBlock.sequenceNumber,
            timestamp: entryBlock.timestamp,
            directoryBlock: { keyMR: directoryBlock.keyMR } as DirectoryBlock
        }));
    publish({ channel: Channel.NewChains, payload: { newChains } });
};

/*****************************
 *  Subscription Resolvers   *
 *****************************/

export const subscription: SubscriptionResolvers = {
    newAdminBlock: {
        subscribe: () => pubsub.asyncIterator(Channel.NewAdminBlock)
    },
    newChains: {
        subscribe: () => pubsub.asyncIterator(Channel.NewChains)
    },
    newDirectoryBlock: {
        subscribe: () => pubsub.asyncIterator(Channel.NewDirectoryBlock)
    },
    newEntryBlock: {
        subscribe: (_, { chainId }) => pubsub.asyncIterator(chainId)
    },
    newEntryCreditBlock: {
        subscribe: () => pubsub.asyncIterator(Channel.NewEntryCreditBlock)
    },
    newFactoidBlock: {
        subscribe: () => pubsub.asyncIterator(Channel.NewFactoidBlock)
    },
    newFactoidTransaction: {
        subscribe: (_, { address }) => pubsub.asyncIterator(address)
    }
};

// start listeners
// prettier-ignore
{
    factomEmitter.on('error', console.error);
    factomEmitter.on('newDirectoryBlock', publishNewChains);
    factomEmitter.on('newDirectoryBlock', publishNewEntryBlocks);
    factomEmitter.on('newFactoidBlock', publishNewTransactions);
    factomEmitter.on('newDirectoryBlock', compose(publish, directoryBlockParams));
    factomEmitter.on('newDirectoryBlock', compose(publish, entryCreditBlockParams));
    factomEmitter.on('newDirectoryBlock', compose(publish, factoidBlockParams));
    factomEmitter.on('newDirectoryBlock', (d) => adminBlockParams(d).then(publish));
}
