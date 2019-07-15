import { FactomdDataLoader } from '../data_loader';
import { PubSub } from 'apollo-server';
import { DataSource } from 'apollo-datasource';
import { FactomdDataSource } from '../datasource';
import { Channel } from '../contants';

export interface Context {
    factomd: FactomdDataLoader;
    pubsub: PubSub;
    dataSources: {
        factomd: FactomdDataSource;
    };
}

export interface PublishParams {
    channel: Channel | string;
    payload: Object;
}
