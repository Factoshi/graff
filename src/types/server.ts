import { FactomdDataLoader } from '../data_loader';
import { PubSub } from 'apollo-server';
import { DataSource } from 'apollo-datasource';
import { FactomdDataSource } from '../datasource';

export interface Context {
    factomd: FactomdDataLoader;
    pubsub: PubSub;
    dataSources: {
        factomd: FactomdDataSource;
    };
}
