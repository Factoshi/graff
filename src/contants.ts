/**
 * Environment variables.
 */
// factomd
export const FACTOMD_HOST = process.env.FACTOMD_HOST;
export const FACTOMD_PORT = process.env.FACTOMD_PORT;
export const FACTOMD_PATH = process.env.FACTOMD_PATH;
export const FACTOMD_USER = process.env.FACTOMD_USER;
export const FACTOMD_PASSWD = process.env.FACTOMD_PASSWD;
export const FACTOMD_PROTO = process.env.FACTOM_PROTOCOL;

// Subscription channels
export enum Channel {
    NewAdminBlock = 'NEW_ADMIN_BLOCK',
    NewDirectoryBlock = 'NEW_DIRECTORY_BLOCK',
    NewChains = 'NEW_CHAINS',
    NewEntryCreditBlock = 'NEW_ENTRY_CREDIT_BLOCK',
    NewFactoidBlock = 'NEW_FACTOID_BLOCK',
    newEntryBlock = 'NEW_ENTRY_BLOCK'
}
