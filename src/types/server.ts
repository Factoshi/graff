import { PubSub } from 'apollo-server';
import { Channel } from '../contants';
import { KeyValueCache } from 'apollo-server-core';
import { FactomdDataSource } from '../dataSource';

export interface Context {
    pubsub: PubSub;
    cache: KeyValueCache;
    dataSources: { factomd: FactomdDataSource };
}

export interface PublishParams {
    channel: Channel | string;
    payload: Object;
}
