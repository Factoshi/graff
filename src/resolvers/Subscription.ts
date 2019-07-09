import { SubscriptionResolvers } from '../types/resolvers';
import { factomEmitter } from '../factom';
import { PubSub } from 'apollo-server';
import { AdminBlock } from 'factom';

const pubsub = new PubSub();

export const listenForNewAdminBlocks = () => {
    factomEmitter.on('newAdminBlock', (adminBlock: AdminBlock) => {
        pubsub.publish('newAdminBlock', {
            newAdminBlock: { hash: adminBlock.backReferenceHash }
        });
    });
};

export const subscription: SubscriptionResolvers = {
    newAdminBlock: {
        subscribe: () => {
            listenForNewAdminBlocks();
            return pubsub.asyncIterator(['newAdminBlock']);
        }
    }
};
