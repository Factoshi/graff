import { FactomdDataLoader } from '../data_loader';
import { PubSub } from 'apollo-server';
import { Channel } from '../contants';

export interface Context {
    factomd: FactomdDataLoader;
    pubsub: PubSub;
}

export interface PublishParams {
    channel: Channel | string;
    payload: Object;
}
