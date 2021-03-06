/**
 * Environment variables.
 */
const env = process.env;
// factomd
export const FACTOMD_HOST = env.FACTOMD_HOST || 'localhost';
export const FACTOMD_PORT = env.FACTOMD_PORT ? parseInt(env.FACTOMD_PORT) : 8088;
export const FACTOMD_PATH = env.FACTOMD_PATH || '/v2';
export const FACTOMD_USER = env.FACTOMD_USER;
export const FACTOMD_PASSWD = env.FACTOMD_PASSWD;
export const FACTOMD_PROTOCOL = env.FACTOMD_PROTOCOL || 'http';

// Redis config
export const REDIS_PORT = env.REDIS_PORT ? parseInt(env.REDIS_PORT) : 6379;
export const REDIS_HOST = env.REDIS_HOST;
export const REDIS_PASSWD = env.REDIS_PASSWD;
export const REDIS_FAMILY = env.REDIS_FAMILY === '6' ? 6 : 4; // IP version
export const REDIS_DB = env.REDIS_DB ? parseInt(env.REDIS_DB) : 0;

// Server config
export const GQL_PLAYGROUND = env.GQL_PLAYGROUND
    ? env.GQL_PLAYGROUND === 'true'
    : env.NODE_ENV !== 'production';
export const GQL_PORT = env.GQL_PORT
    ? parseInt(env.GQL_PORT)
    : env.NODE_ENV !== 'production'
    ? 4000
    : 8032;
export const GQL_INTROSPEC = env.GQL_INTROSPEC
    ? env.GQL_INTROSPEC === 'true'
    : env.NODE_ENV !== 'production';
export const MAX_PAGE_LENGTH = env.MAX_PAGE_LENGTH ? parseInt(env.MAX_PAGE_LENGTH) : 150;
export const MAX_QUERY_DEPTH = env.MAX_QUERY_DEPTH ? parseInt(env.MAX_QUERY_DEPTH) : 7;
export const MAX_COMPLEXITY = env.MAX_COMPLEXITY ? parseInt(env.MAX_COMPLEXITY) : 1500;

// Subscription channels
export enum Channel {
    NewAdminBlock = 'NEW_ADMIN_BLOCK',
    NewDirectoryBlock = 'NEW_DIRECTORY_BLOCK',
    NewChains = 'NEW_CHAINS',
    NewEntryCreditBlock = 'NEW_ENTRY_CREDIT_BLOCK',
    NewFactoidBlock = 'NEW_FACTOID_BLOCK',
    newEntryBlock = 'NEW_ENTRY_BLOCK'
}

// Mutation methods
export enum MutationMethod {
    CommitChain = 'commit-chain',
    RevealChain = 'reveal-chain',
    CommitEntry = 'commit-entry',
    RevealEntry = 'reveal-entry',
    SubmitTx = 'factoid-submit'
}
