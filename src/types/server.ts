import { FactomdDataLoader } from '../data_loader';
import { PubSub } from 'apollo-server';

export interface Context {
    factomd: FactomdDataLoader;
    pubsub: PubSub;
}
