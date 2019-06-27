import { Query } from './Query';
import { Hash, PublicEntryCreditAddress, PublicFactoidAddress } from './scalar';
import { Resolvers } from '../types/resolvers';

export const resolvers: Resolvers = {
    //Queries
    Query,
    // Scalars
    Hash,
    PublicEntryCreditAddress,
    PublicFactoidAddress
};
