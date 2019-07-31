import {
    QueryResolvers,
    EntryCreditBlockResolvers,
    EntryCommit
} from '../types/resolvers';
import { testPaginationInput, handleBlockError } from './resolver-helpers';
import { MAX_PAGE_LENGTH } from '../constants';

const resolveField = (field: string) => {
    return async ({ headerHash }: any, _: any, { dataSources }: any) => {
        const entryCreditBlock = await dataSources.factomd.getEntryCreditBlock(
            headerHash!
        );
        return entryCreditBlock[field];
    };
};

/**
 * Root Query resolvers that return a partial AdminBlock type.
 */
export const entryCreditBlockQueries: QueryResolvers = {
    entryCreditBlock: async (_, { hash }, { dataSources }) => {
        const entryCreditBlock = await dataSources.factomd
            .getEntryCreditBlock(hash)
            .catch(handleBlockError);
        return entryCreditBlock && { headerHash: entryCreditBlock.headerHash };
    },
    entryCreditBlockByHeight: async (_, { height }, { dataSources }) => {
        const entryCreditBlock = await dataSources.factomd
            .getEntryCreditBlock(height!)
            .catch(handleBlockError);
        return entryCreditBlock && { headerHash: entryCreditBlock.headerHash };
    }
};

/**
 * AdminBlock type resolvers. All resolvers expect the parent to provide the headerHash.
 */
export const entryCreditBlockResolvers: EntryCreditBlockResolvers = {
    fullHash: resolveField('fullHash'),
    bodyHash: resolveField('bodyHash'),
    bodySize: resolveField('bodySize'),
    objectCount: resolveField('objectCount'),
    previousBlock: async ({ headerHash }, _, { dataSources }) => {
        const entryCreditBlock = await dataSources.factomd.getEntryCreditBlock(
            headerHash!
        );
        const previousBlock = await dataSources.factomd
            .getEntryCreditBlock(entryCreditBlock.previousHeaderHash)
            .catch(handleBlockError);
        return previousBlock && { headerHash: previousBlock.headerHash };
    },
    nextBlock: async ({ headerHash }, _, { dataSources }) => {
        const entryCreditBlock = await dataSources.factomd.getEntryCreditBlock(
            headerHash!
        );
        const nextBlock = await dataSources.factomd
            .getEntryCreditBlock(entryCreditBlock.directoryBlockHeight + 1)
            .catch(handleBlockError);
        return nextBlock && { headerHash: nextBlock.headerHash };
    },
    commitPage: async (
        { headerHash },
        { offset = 0, first = MAX_PAGE_LENGTH },
        { dataSources }
    ) => {
        testPaginationInput(offset!, first!);
        const entryCreditBlock = await dataSources.factomd.getEntryCreditBlock(
            headerHash!
        );
        const commits = entryCreditBlock.commits
            .slice(offset!, offset! + first!)
            .map(commit => ({
                timestamp: commit.millis,
                entry: { hash: commit.entryHash },
                credits: commit.credits,
                paymentAddress: commit.ecPublicKey,
                entryCreditBlock: { headerHash: headerHash },
                signature: commit.signature
            })) as EntryCommit[];
        return {
            commits,
            totalCount: entryCreditBlock.commits.length,
            offset: offset as number,
            pageLength: commits.length
        };
    },
    directoryBlock: async ({ headerHash }, _, { dataSources }) => {
        const entryCreditBlock = await dataSources.factomd.getEntryCreditBlock(
            headerHash!
        );
        const directoryBlock = await dataSources.factomd.getDirectoryBlock(
            entryCreditBlock.directoryBlockHeight
        );
        return { keyMR: directoryBlock.keyMR };
    }
};
