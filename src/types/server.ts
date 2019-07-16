import { FactomdDataLoader } from '../data_loader';
import { PubSub } from 'apollo-server';
import { Channel } from '../contants';
import { KeyValueCache } from 'apollo-server-core';
import { ProtocolBlockSource } from '../datasource/ProtocolBlock';

export interface Context {
    factomd: FactomdDataLoader;
    pubsub: PubSub;
    cache: KeyValueCache;
    dataSources: { protocolBlock: ProtocolBlockSource };
}

export interface PublishParams {
    channel: Channel | string;
    payload: Object;
}
