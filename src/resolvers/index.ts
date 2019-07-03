import { Query } from './Query';
import { Hash, PublicEntryCreditAddress, PublicFactoidAddress, Height } from './scalar';
import { Resolvers } from '../types/resolvers';
import { adminBlockResolvers } from './AdminBlock';
import { adminEntryResolvers } from './AdminEntry';
import { directoryBlockResolvers } from './DirectoryBlock';
import { entryBlockResolvers } from './EntryBlock';
import { entryCreditBlockResolvers } from './EntryCreditBlock';
import { factoidBlockResolvers } from './FactoidBlock';
import { transactionResolvers } from './Transaction';
import { entryResolvers } from './Entry';

export const resolvers: Resolvers = {
    //Queries
    AdminBlock: adminBlockResolvers,
    AdminEntry: adminEntryResolvers,
    DirectoryBlock: directoryBlockResolvers,
    Entry: entryResolvers,
    EntryBlock: entryBlockResolvers,
    EntryCreditBlock: entryCreditBlockResolvers,
    FactoidBlock: factoidBlockResolvers,
    Query,
    Transaction: transactionResolvers,
    // Scalars
    Hash,
    PublicEntryCreditAddress,
    PublicFactoidAddress,
    Height
};
