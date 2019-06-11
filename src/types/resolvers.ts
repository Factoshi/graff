import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";
import { Context } from "./server";
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Sha256 hash. */
  Hash: string;
  /** Public entry credit address. */
  PublicEntryCreditAddress: string;
  /** Public factoid address. */
  PublicFactoidAddress: string;
};

/** Possible states of a ledger entry. */
export enum Ack {
  /** Found in the blockchain. */
  DirectoryBlockConfirmed = "DIRECTORY_BLOCK_CONFIRMED",
  /** Found on local node but not on the network. */
  NotConfirmed = "NOT_CONFIRMED",
  /** Found on the network but not yet in the blockchain. */
  TransactionAck = "TRANSACTION_ACK",
  /** Not found anywhere. */
  Unknown = "UNKNOWN"
}

/** Sets what percentage of the Factoid rewards for the specified server are yeilded to the Grant Pool.
 * AdminIDs: [14]
 * AdminCodes: [ADD_AUTHORITY_EFFICIENCY]
 */
export type AddAuthorityEfficiency = AdminEntry & {
  __typename?: "AddAuthorityEfficiency";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
  /** The server identity chain. */
  identityChainId: Scalars["Hash"];
  /** Efficiency with two fixed decimal places. */
  efficiency: Scalars["Int"];
};

/** Sets a Factoid address to be used in the Coinbase Descriptor.
 * AdminIDs: [13]
 * AdminCodes: [ADD_AUTHORITY_FACTOID_ADDRESS]
 */
export type AddAuthorityFactoidAddress = AdminEntry & {
  __typename?: "AddAuthorityFactoidAddress";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
  /** The server identity chain. */
  identityChainId: Scalars["Hash"];
  /** Factoid address to receive output. */
  rcdHash: Scalars["Hash"];
  /** Public Address to receive coinbase transaction output. */
  factoidAddress: Scalars["PublicFactoidAddress"];
};

/** Adds an ecdsa public bitcoin signing key to an authority identity.
 * AdminIDs: [9]
 * AdminCodes: [ADD_FEDERATED_SERVER_BITCOIN_ANCHOR_KEY]
 */
export type AddFederatedServerBitcoinAnchorKey = AdminEntry & {
  __typename?: "AddFederatedServerBitcoinAnchorKey";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
  /** The server identity chain. */
  identityChainId: Scalars["Hash"];
  /** The priority of the key. */
  keyPriority: Scalars["Int"];
  /** Bitcoin key type */
  keyType: Scalars["String"];
  /** Public bitcoin key */
  ecdsaPublicKey: Scalars["String"];
};

/** Adds an ed25519 public key to an authority identity.
 * AdminIDs: [8]
 * AdminCodes: [ADD_FEDERATED_SERVER_SIGNING_KEY]
 */
export type AddFederatedServerSigningKey = AdminEntry & {
  __typename?: "AddFederatedServerSigningKey";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
  /** The server identity chain. */
  identityChainId: Scalars["Hash"];
  /** The priority of the key. */
  keyPriority: Scalars["Int"];
  /** Public key to be added. */
  publicKey: Scalars["String"];
  /** The directory block height at which the change will take effect. */
  directoryBlockHeight: Scalars["Int"];
};

/** Add or remove server identity.
 * AdminIDs: [5, 6, 7]
 * AdminCodes: [ADD_FEDERATED_SERVER, ADD_AUDIT_SERVER, REMOVE_FEDERATED_SERVER]
 */
export type AddRemoveServer = AdminEntry & {
  __typename?: "AddRemoveServer";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
  /** The server identity chain. */
  identityChainId: Scalars["Hash"];
  /** The directory block height at which the change will take effect. */
  directoryBlockHeight: Scalars["Int"];
};

/** Admin Block */
export type AdminBlock = Block & {
  __typename?: "AdminBlock";
  /** The hash of the current block. */
  hash: Scalars["Hash"];
  /** The previous block. */
  prevBlock?: Maybe<AdminBlock>;
  /** The next block. */
  nextBlock?: Maybe<AdminBlock>;
  /** Array of admin entries contained within this admin block. */
  entries: Array<AdminEntry>;
  /** Parent directory block. */
  directoryBlock: DirectoryBlock;
};

/** Admin codes attached to each admin entry */
export enum AdminCode {
  /** Admin ID 1 */
  DirectoryBlockSignature = "DIRECTORY_BLOCK_SIGNATURE",
  /** Admin ID 2 */
  RevealMatryoshkaHash = "REVEAL_MATRYOSHKA_HASH",
  /** Admin ID 3 */
  AddReplaceMatryoshkaHash = "ADD_REPLACE_MATRYOSHKA_HASH",
  /** Admin ID 4 */
  IncreaseServerCount = "INCREASE_SERVER_COUNT",
  /** Admin ID 5 */
  AddFederatedServer = "ADD_FEDERATED_SERVER",
  /** Admin ID 6 */
  AddAuditServer = "ADD_AUDIT_SERVER",
  /** Admin ID 7 */
  RemoveFederatedServer = "REMOVE_FEDERATED_SERVER",
  /** Admin ID 8 */
  AddFederatedServerSigningKey = "ADD_FEDERATED_SERVER_SIGNING_KEY",
  /** Admin ID 9 */
  AddFederatedServerBitcoinAnchorKey = "ADD_FEDERATED_SERVER_BITCOIN_ANCHOR_KEY",
  /** Admin ID 10 */
  ServerFaultHandoff = "SERVER_FAULT_HANDOFF",
  /** Admin ID 11 */
  CoinbaseDescriptor = "COINBASE_DESCRIPTOR",
  /** Admin ID 12 */
  CoinbaseDescriptorCancel = "COINBASE_DESCRIPTOR_CANCEL",
  /** Admin ID 13 */
  AddAuthorityFactoidAddress = "ADD_AUTHORITY_FACTOID_ADDRESS",
  /** Admin ID 14 */
  AddAuthorityEfficiency = "ADD_AUTHORITY_EFFICIENCY"
}

/** Minimum requirements of an admin entry. */
export type AdminEntry = {
  __typename?: "AdminEntry";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
};

/** Defines the fields shared by all blocks. */
export type Block = {
  __typename?: "Block";
  /** The hash of the current block. */
  hash: Scalars["Hash"];
};

/** Creates a future genesis transaction.
 * AdminIDs: [11]
 * AdminCodes: [COINBASE_DESCRIPTOR]
 */
export type CoinbaseDescriptor = AdminEntry & {
  __typename?: "CoinbaseDescriptor";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
  /** Array of coinbase descriptor outputs. */
  outputs: Array<CoinbaseDescriptorOutput>;
};

/** Cancels a specific output index in an earlier Coinbase Descriptor.
 * AdminIDs: [12]
 * AdminCodes: [COINBASE_DESCRIPTOR_CANCEL]
 */
export type CoinbaseDescriptorCancel = AdminEntry & {
  __typename?: "CoinbaseDescriptorCancel";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
  /** An output the Descriptor at this height will not be created. */
  descriptorHeight: Scalars["Int"];
  /** This index into the specified descriptor will not be created. */
  descriptorIndex: Scalars["Int"];
};

/** Coinbase descriptor output. */
export type CoinbaseDescriptorOutput = {
  __typename?: "CoinbaseDescriptorOutput";
  /** Public Address to receive coinbase transaction output. */
  address: Scalars["PublicFactoidAddress"];
  /** Factoid address to receive output. */
  rcdHash: Scalars["Hash"];
  /** Amount by which to increase the address. */
  amount: Scalars["Int"];
};

/** Entry commit included in the blockchain. */
export type Commit = {
  __typename?: "Commit";
  /** Milliseconds since Unix epoch. */
  timestamp: Scalars["Int"];
  /** The hash of the committed entry. */
  entryHash: Scalars["Hash"];
  /** The entry that was committed. Will be null if not yet revealed. */
  entry?: Maybe<Entry>;
  /** The cost of the entry. */
  credits: Scalars["Int"];
  /** The entry credit address that paid for the entry. */
  paymentAddress: Scalars["PublicEntryCreditAddress"];
  /** The parent entry credit block of the commit. */
  block: EntryCreditBlock;
};

/** Response following a chain or entry commmit or reveal, or a factoid transaction. */
export type CommitRevealSend = {
  __typename?: "CommitRevealSend";
  /** The hash of the entry that was committed or revealed. Always null for factoid transactions. */
  entryHash?: Maybe<Scalars["Hash"]>;
  /** The transaction hash. Always null for reveals. */
  transactionHash?: Maybe<Scalars["Hash"]>;
  /** The chain that was committed to. Always null for entry commits and factoid transactions. */
  chain?: Maybe<Scalars["Hash"]>;
};

/** Blockchain time state. */
export type CurrentMinute = {
  __typename?: "CurrentMinute";
  /** The current block height. */
  leaderHeight: Scalars["Int"];
  /** The highest saved directory block height of the factomd API server. */
  directoryBlockHeight: Scalars["Int"];
  /** The minute number of the open entry block. */
  minute: Scalars["Int"];
  /** The start time of the current block. */
  currentBlockStartTime: Scalars["Int"];
  /** The start time of the current minute. */
  currentMinuteStartTime: Scalars["Int"];
  /** The time as understood by factomd. */
  currentTime: Scalars["Int"];
  /** The number of seconds per block. */
  directoryBlockInSeconds: Scalars["Int"];
  /** Boolean to determine whether factomd thinks it is stalled. */
  stallDetected: Scalars["Boolean"];
  /** The number of seconds before leader node is faulted for failing to provide a necessary message. */
  faultTimeout: Scalars["Int"];
  /** The number of seconds between rounds of an election during a fault. */
  roundTimeout: Scalars["Int"];
};

/** Directory Block */
export type DirectoryBlock = Block & {
  __typename?: "DirectoryBlock";
  /** The hash of the current block. */
  hash: Scalars["Hash"];
  /** The previous block. */
  prevBlock?: Maybe<DirectoryBlock>;
  /** The next block. */
  nextBlock?: Maybe<DirectoryBlock>;
  /** Block height. */
  height: Scalars["Int"];
  /** Milliseconds since Unix epoch. Marks the start of the block. */
  timestamp: Scalars["Int"];
  /** The admin block referenced by this directory block. */
  adminBlock: AdminBlock;
  /** The entry blocks referenced by this directory block. */
  entryBlocks: PaginatedEntryBlocks;
  /** The entry credit block referenced by this directory block. */
  entryCreditBlock: EntryCreditBlock;
  /** The factoid block referenced by this directory block. */
  factoidBlock: FactoidBlock;
};

/** Directory Block */
export type DirectoryBlockEntryBlocksArgs = {
  first?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
};

/** Authority identity signature to consent to previous directory block.
 * AdminIDs: [1]
 * AdminCodes: [DIRECTORY_BLOCK_SIGNATURE]
 */
export type DirectoryBlockSignature = AdminEntry & {
  __typename?: "DirectoryBlockSignature";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
  /** The identity chain of the signing authority. */
  identityChainId: Scalars["Hash"];
  /** Signature for the previous directorty block. */
  previousDirectoryBlockSignature?: Maybe<PreviousDirectoryBlockSignature>;
};

/** Entry included in the blockchain. */
export type Entry = {
  __typename?: "Entry";
  /** The hash of the entry */
  hash: Scalars["Hash"];
  /** The chain the entry belongs to. */
  chain: Scalars["Hash"];
  /** The timestamp of the entry. */
  timestamp: Scalars["Int"];
  /** List of external IDs associated with the entry as base64. */
  externalIds: Array<Scalars["String"]>;
  /** The content of the entry as base64. */
  content: Scalars["String"];
  /** The parent entry block of the entry. */
  block: EntryBlock;
};

/** Entry Block */
export type EntryBlock = Block & {
  __typename?: "EntryBlock";
  /** The hash of the current block. */
  hash: Scalars["Hash"];
  /** The previous block. */
  prevBlock?: Maybe<EntryBlock>;
  /** The next block. */
  nextBlock?: Maybe<EntryBlock>;
  /** The ID of the parent chain. */
  chain: Scalars["Hash"];
  /** Height of entry block. Also known as sequence number. */
  height: Scalars["Int"];
  /** Milliseconds since Unix epoch. Marks the start of the block. */
  timestamp: Scalars["Int"];
  /** Paginated entries contained within this entry block */
  entries: PaginatedEntries;
  /** Parent directory block. */
  directoryBlock: DirectoryBlock;
};

/** Entry Block */
export type EntryBlockEntriesArgs = {
  first?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
};

/** State of an entry or commit. */
export type EntryCommitAck = {
  __typename?: "EntryCommitAck";
  /** The hash of the commit. */
  commitHash: Scalars["Hash"];
  /** The status of the commit. */
  commitStatus: Ack;
  /** The hash of the entry. May be null if the commit has not yet been revealed. */
  entryHash?: Maybe<Scalars["Hash"]>;
  /** The status of the entry. */
  entryStatus: Ack;
};

/** Entry credit address and associated amount. */
export type EntryCreditAddress = {
  __typename?: "EntryCreditAddress";
  /** Amount may be balance or output value, depending on the context. */
  amount: Scalars["Int"];
  /** Public entry credit address. */
  publicAddress: Scalars["PublicEntryCreditAddress"];
  /** Address as RCD Hash */
  address?: Maybe<Scalars["Hash"]>;
};

/** Entry Credit Block */
export type EntryCreditBlock = Block & {
  __typename?: "EntryCreditBlock";
  /** The hash of the current block. */
  hash: Scalars["Hash"];
  /** The previous block. */
  prevBlock?: Maybe<EntryCreditBlock>;
  /** The next block. */
  nextBlock?: Maybe<EntryCreditBlock>;
  /** Paginated commits contained within the entry credit block */
  commits: PaginatedCommits;
  /** Parent directory block. */
  directoryBlock: DirectoryBlock;
};

/** Entry Credit Block */
export type EntryCreditBlockCommitsArgs = {
  first?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
};

/** Factoid address and associated amount. */
export type FactoidAddress = {
  __typename?: "FactoidAddress";
  /** Amount may be balance or input/output value, depending on the context. */
  amount: Scalars["Int"];
  /** Public factoid address. */
  publicAddress: Scalars["PublicFactoidAddress"];
  /** Address as RCD Hash */
  address?: Maybe<Scalars["Hash"]>;
};

/** Factoid Block */
export type FactoidBlock = Block & {
  __typename?: "FactoidBlock";
  /** The hash of the current block. */
  hash: Scalars["Hash"];
  /** The previous block. */
  prevBlock?: Maybe<FactoidBlock>;
  /** The next block. */
  nextBlock?: Maybe<FactoidBlock>;
  /** EC-FCT exchange rate. */
  entryCreditRate: Scalars["Int"];
  /** Paginated transactions contained within the factoid block */
  transactions: PaginatedTransactions;
  /** Parent directory block. */
  directoryBlock: DirectoryBlock;
};

/** Factoid Block */
export type FactoidBlockTransactionsArgs = {
  first?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
};

/** Status of a factoid transaction. */
export type FactoidTransactionAck = {
  __typename?: "FactoidTransactionAck";
  /** Transaction hash, otherwise known as transaction ID. */
  hash: Scalars["Hash"];
  /** The timestamp of the transaction. Milliseconds since Unix epoch. */
  txTimestamp?: Maybe<Scalars["Int"]>;
  /** The date of the transaction. Human-readable format. */
  txDate?: Maybe<Scalars["String"]>;
  /** The timestamp of the containing block. Milliseconds since Unix epoch. */
  blockTimestamp?: Maybe<Scalars["Int"]>;
  /** The date of the containing block. Human-readable format. */
  blockDate?: Maybe<Scalars["Int"]>;
  /** The status of the factoid transaction */
  status: Ack;
};

/** Network and server heights. */
export type Heights = {
  __typename?: "Heights";
  /** The current block height. */
  leaderHeight: Scalars["Int"];
  /** The highest saved directory block height of the factomd API server. */
  directoryBlockHeight: Scalars["Int"];
  /** The height at which the factomd API server has all the entry blocks. */
  entryBlockHeight: Scalars["Int"];
  /** The height at which the local factomd API server has all the entries. */
  entryHeight: Scalars["Int"];
};

/** Increment the server count.
 * AdminIDs: [4]
 * AdminCodes: [INCREASE_SERVER_COUNT]
 */
export type IncreaseServerCount = AdminEntry & {
  __typename?: "IncreaseServerCount";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
  /** Amount by which to increase the server count. */
  amount: Scalars["Int"];
};

/** Determine the order in which the leader servers are rotated. Not currently implemented.
 * AdminIDs: [2, 3]
 * AdminCodes: [REVEAL_MATRYOSHKA_HASH, ADD_REPLACE_MATRYOSHKA_HASH]
 */
export type MatryoshkaHash = AdminEntry & {
  __typename?: "MatryoshkaHash";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
  /** The server identity chain. */
  identityChainId: Scalars["Hash"];
  /** The matryoshka hash. */
  matryoshkaHash: Scalars["String"];
};

/** A node in a merkle tree. */
export type MerkleNode = {
  __typename?: "MerkleNode";
  /** Left hash. */
  left: Scalars["Hash"];
  /** Right hash. */
  right: Scalars["Hash"];
  /** Hash of top node. */
  top: Scalars["Hash"];
};

export type Mutation = {
  __typename?: "Mutation";
  /** Send a Chain Commit Message to factomd to create a new Chain. */
  commitChain: CommitRevealSend;
  /** Send an Entry Commit Message to factom to create a new Entry. */
  commitEntry: CommitRevealSend;
  /** Reveal the First Entry in a Chain to factomd after the Commit to complete the Chain creation. */
  revealChain: CommitRevealSend;
  /** Reveal an Entry to factomd after the Commit to complete the Entry creation. */
  revealEntry: CommitRevealSend;
  /** Submit a factoid transaction. */
  sendFactoids: CommitRevealSend;
};

/** Basic pagination interface. */
export type Paginated = {
  __typename?: "Paginated";
  /** Total number of nodes available for pagination. */
  totalCount: Scalars["Int"];
};

/** Paginated commits */
export type PaginatedCommits = Paginated & {
  __typename?: "PaginatedCommits";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** An array of commits. */
  commits: Array<Commit>;
};

/** Paginated entries */
export type PaginatedEntries = Paginated & {
  __typename?: "PaginatedEntries";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** An array of entries. */
  entries: Array<Entry>;
};

/** Paginated entry blocks */
export type PaginatedEntryBlocks = Paginated & {
  __typename?: "PaginatedEntryBlocks";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** An array of entry blocks. */
  entryBlocks: Array<EntryBlock>;
};

/** Paginated pending entries */
export type PaginatedPendingEntries = Paginated & {
  __typename?: "PaginatedPendingEntries";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** An array of pending entries. */
  pendingEntries: Array<PendingEntry>;
};

/** Pagianted pending transactions */
export type PaginatedPendingTransactions = Paginated & {
  __typename?: "PaginatedPendingTransactions";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** An array of pending transactions. */
  pendingTransactions: Array<PendingTransaction>;
};

/** Paginated transactions */
export type PaginatedTransactions = Paginated & {
  __typename?: "PaginatedTransactions";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** An array of transactions. */
  transactions: Array<Transaction>;
};

/** Entry not yet included in the blockchain. */
export type PendingEntry = {
  __typename?: "PendingEntry";
  /** The transaction hash. Also known as the transaction ID. */
  hash: Scalars["Hash"];
  /** The status of the commit. */
  status: Ack;
  /** The chain the entry belongs to. */
  chain?: Maybe<Scalars["Hash"]>;
};

/** Factoid transaction not yet included in the blockchain. */
export type PendingTransaction = {
  __typename?: "PendingTransaction";
  /** The transaction hash. Also known as the transaction ID. */
  hash: Scalars["Hash"];
  /** The status of the commit. */
  status: Ack;
  /** An array of factoid inputs. */
  inputs: Array<FactoidAddress>;
  /** An array of factoid outputs */
  factoidOutputs: Array<FactoidAddress>;
  /** An array of entry credit outputs. */
  entryCreditOutputs: Array<EntryCreditAddress>;
  /** The total value of all inputs. Denominated in factoshis. */
  totalInputs: Scalars["Int"];
  /** The total value of all factoid outputs. Denominated in factoshis. */
  totalFactoidOutputs: Scalars["Int"];
  /** The total value of all entry credit outputs. Denominated in entry credits. */
  totalEntryCreditOutputs: Scalars["Int"];
  /** The fees burned for the transaction. Denominated in factoshis. */
  fees: Scalars["Int"];
};

/** Signature for the previous directory block header. */
export type PreviousDirectoryBlockSignature = {
  __typename?: "PreviousDirectoryBlockSignature";
  /** Ed25519 public key held in the authority identity chain. */
  publicKey: Scalars["String"];
  /** signature of the previous directoty block header */
  signature: Scalars["String"];
};

/** Fctomd and API properties. */
export type Properties = {
  __typename?: "Properties";
  /** The version of the factomd API server. */
  factomdVersion: Scalars["String"];
  /** The version of the factomd API. */
  factomdApiVersion: Scalars["String"];
  /** The version fo the GraphQL API. */
  graphQLApiVersion: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  /** Get an admin block by the specified block hash. */
  adminBlock?: Maybe<AdminBlock>;
  /** Get an admin block by the specified block height. */
  adminBlockByHeight?: Maybe<AdminBlock>;
  /** Get the admin block at the tip of the admin chain. */
  adminBlockHead?: Maybe<AdminBlock>;
  /** Get the entry block at the tip of the specified chain. */
  chainHead?: Maybe<EntryBlock>;
  /** Get protocol time state. */
  currentMinute: CurrentMinute;
  /** Get a directory block by the specified block hash. */
  directoryBlock?: Maybe<DirectoryBlock>;
  /** Get a directory block by the specified block height. */
  directoryBlockByHeight?: Maybe<DirectoryBlock>;
  /** Get the directory block at the tip of the directory chain. */
  directoryBlockHead?: Maybe<DirectoryBlock>;
  /** Get an entry by its hash. */
  entry?: Maybe<Entry>;
  /** Get an entry block by the specified block hash. */
  entryBlock?: Maybe<EntryBlock>;
  /** Entry or commit status. */
  entryCommitAck: EntryCommitAck;
  /** Get the balance of a public entry credit address. */
  entryCreditBalance: EntryCreditAddress;
  /** Get an entry credit block by the specified block hash. */
  entryCreditBlock?: Maybe<EntryCreditBlock>;
  /** Get an entry credit block by the specified block height. */
  entryCreditBlockByHeight?: Maybe<EntryCreditBlock>;
  /** Get the entry credit block at the tip of the entry credit chain. */
  entryCreditBlockHead?: Maybe<EntryCreditBlock>;
  /** Get the EC-FCT exchange rate. */
  entryCreditRate: Scalars["Int"];
  /** Get the balance of a public factoid address. */
  factoidBalance: FactoidAddress;
  /** Get a factoid block by the specified block hash. */
  factoidBlock?: Maybe<FactoidBlock>;
  /** Get a factoid block by the specified block height. */
  factoidBlockByHeight?: Maybe<FactoidBlock>;
  /** Get the factoid block at the tip of the factoid chain. */
  factoidBlockHead?: Maybe<FactoidBlock>;
  /** Factoid transaction status. */
  factoidTransactionAck: FactoidTransactionAck;
  /** Get blockchain heights. */
  heights: Heights;
  /** Get paginated pending entries. */
  pendingEntries: PaginatedPendingEntries;
  /** Get paginated pending entries. */
  pendingTransactions: PaginatedPendingTransactions;
  /** Get properties of factomd and the APIs. */
  properties: Properties;
  /** Get an entry receipt */
  receipt?: Maybe<Receipt>;
  /** Get a transaction by its hash. */
  transaction?: Maybe<Transaction>;
};

export type QueryAdminBlockArgs = {
  hash: Scalars["Hash"];
};

export type QueryAdminBlockByHeightArgs = {
  height: Scalars["Int"];
};

export type QueryChainHeadArgs = {
  chain: Scalars["Hash"];
};

export type QueryDirectoryBlockArgs = {
  hash: Scalars["Hash"];
};

export type QueryDirectoryBlockByHeightArgs = {
  height: Scalars["Int"];
};

export type QueryEntryArgs = {
  hash: Scalars["Hash"];
};

export type QueryEntryBlockArgs = {
  hash: Scalars["Hash"];
};

export type QueryEntryCommitAckArgs = {
  hash: Scalars["Hash"];
  chain?: Maybe<Scalars["Hash"]>;
};

export type QueryEntryCreditBalanceArgs = {
  address: Scalars["PublicEntryCreditAddress"];
};

export type QueryEntryCreditBlockArgs = {
  hash: Scalars["Hash"];
};

export type QueryEntryCreditBlockByHeightArgs = {
  height: Scalars["Int"];
};

export type QueryFactoidBalanceArgs = {
  address: Scalars["PublicFactoidAddress"];
};

export type QueryFactoidBlockArgs = {
  hash: Scalars["Hash"];
};

export type QueryFactoidBlockByHeightArgs = {
  height: Scalars["Int"];
};

export type QueryFactoidTransactionAckArgs = {
  hash: Scalars["Hash"];
};

export type QueryReceiptArgs = {
  hash: Scalars["Hash"];
};

export type QueryTransactionArgs = {
  hash: Scalars["Hash"];
};

/** Proof that an entry has been anchored in the bitcoin blockchain. */
export type Receipt = {
  __typename?: "Receipt";
  /** The entry this receipt is for. */
  entry: Entry;
  /** The entry block of the entry. */
  entryBlock: EntryBlock;
  /** The directory block of the entry. */
  directoryBlock: DirectoryBlock;
  /** The hash of the bitcoin transaction that anchored this entry into Bitcoin. */
  bitcoinTransactionHash: Scalars["Hash"];
  /** The bitcoin block where the anchored transaction was included. */
  bitcoinBlockHash: Scalars["Hash"];
  /** The merkle proof to connect the entry to the bitcoin transaction. */
  merkleBranch: Array<MerkleNode>;
};

/** Rolls up messages that led to the promotion/demotion of identities during an election.
 * Not currently serialized into the blockchain.
 * AdminIDs: [10]
 * AdminCodes: [SERVER_FAULT_HANDOFF]
 */
export type ServerFaultHandoff = AdminEntry & {
  __typename?: "ServerFaultHandoff";
  /** The ID of the admin entry. */
  id: Scalars["Int"];
  /** The code of the admin entry. */
  code: AdminCode;
};

export type Subscription = {
  __typename?: "Subscription";
  /** Subscribe to each new admin block. */
  newAdminBlock: AdminBlock;
  /** Subscribe to newly created chains. */
  newChainsCreated: Array<PaginatedEntryBlocks>;
  /** Subscribe to each new directory block. */
  newDirectoryBlock: DirectoryBlock;
  /** Subscribe to each new entry block for a specified chain. */
  newEntryBlock: EntryBlock;
  /** Subscribe to each new entry credit block. */
  newEntryCreditBlock: EntryCreditBlock;
  /** Subscribe to each new factoid block. */
  newFactoidBlock: FactoidBlock;
};

export type SubscriptionNewEntryBlockArgs = {
  chain: Scalars["Hash"];
};

/** Factoid Transaction included in the blockchain. */
export type Transaction = {
  __typename?: "Transaction";
  /** The transaction hash. Also known as the transaction ID. */
  hash: Scalars["Hash"];
  /** Milliseconds since Unix epoch. */
  timestamp: Scalars["Int"];
  /** An array of factoid inputs. */
  inputs: Array<FactoidAddress>;
  /** An array of factoid outputs */
  factoidOutputs: Array<FactoidAddress>;
  /** An array of entry credit outputs. */
  entryCreditOutputs: Array<EntryCreditAddress>;
  /** The total value of all inputs. Denominated in factoshis. */
  totalInputs: Scalars["Int"];
  /** The total value of all factoid outputs. Denominated in factoshis. */
  totalFactoidOutputs: Scalars["Int"];
  /** The total value of all entry credit outputs. Denominated in entry credits. */
  totalEntryCreditOutputs: Scalars["Int"];
  /** The fees burned for the transaction. Denominated in factoshis. */
  fees: Scalars["Int"];
  /** The parent factoid block of the transaction. */
  block: FactoidBlock;
};
export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: {};
  Hash: Partial<Scalars["Hash"]>;
  AdminBlock: Partial<AdminBlock>;
  Block: Partial<Block>;
  AdminEntry: Partial<AdminEntry>;
  Int: Partial<Scalars["Int"]>;
  AdminCode: Partial<AdminCode>;
  DirectoryBlock: Partial<DirectoryBlock>;
  PaginatedEntryBlocks: Partial<PaginatedEntryBlocks>;
  Paginated: Partial<Paginated>;
  EntryBlock: Partial<EntryBlock>;
  PaginatedEntries: Partial<PaginatedEntries>;
  Entry: Partial<Entry>;
  String: Partial<Scalars["String"]>;
  EntryCreditBlock: Partial<EntryCreditBlock>;
  PaginatedCommits: Partial<PaginatedCommits>;
  Commit: Partial<Commit>;
  PublicEntryCreditAddress: Partial<Scalars["PublicEntryCreditAddress"]>;
  FactoidBlock: Partial<FactoidBlock>;
  PaginatedTransactions: Partial<PaginatedTransactions>;
  Transaction: Partial<Transaction>;
  FactoidAddress: Partial<FactoidAddress>;
  PublicFactoidAddress: Partial<Scalars["PublicFactoidAddress"]>;
  EntryCreditAddress: Partial<EntryCreditAddress>;
  CurrentMinute: Partial<CurrentMinute>;
  Boolean: Partial<Scalars["Boolean"]>;
  EntryCommitAck: Partial<EntryCommitAck>;
  Ack: Partial<Ack>;
  FactoidTransactionAck: Partial<FactoidTransactionAck>;
  Heights: Partial<Heights>;
  PaginatedPendingEntries: Partial<PaginatedPendingEntries>;
  PendingEntry: Partial<PendingEntry>;
  PaginatedPendingTransactions: Partial<PaginatedPendingTransactions>;
  PendingTransaction: Partial<PendingTransaction>;
  Properties: Partial<Properties>;
  Receipt: Partial<Receipt>;
  MerkleNode: Partial<MerkleNode>;
  Mutation: {};
  CommitRevealSend: Partial<CommitRevealSend>;
  Subscription: {};
  DirectoryBlockSignature: Partial<DirectoryBlockSignature>;
  PreviousDirectoryBlockSignature: Partial<PreviousDirectoryBlockSignature>;
  MatryoshkaHash: Partial<MatryoshkaHash>;
  IncreaseServerCount: Partial<IncreaseServerCount>;
  AddRemoveServer: Partial<AddRemoveServer>;
  AddFederatedServerSigningKey: Partial<AddFederatedServerSigningKey>;
  AddFederatedServerBitcoinAnchorKey: Partial<
    AddFederatedServerBitcoinAnchorKey
  >;
  ServerFaultHandoff: Partial<ServerFaultHandoff>;
  CoinbaseDescriptor: Partial<CoinbaseDescriptor>;
  CoinbaseDescriptorOutput: Partial<CoinbaseDescriptorOutput>;
  CoinbaseDescriptorCancel: Partial<CoinbaseDescriptorCancel>;
  AddAuthorityFactoidAddress: Partial<AddAuthorityFactoidAddress>;
  AddAuthorityEfficiency: Partial<AddAuthorityEfficiency>;
}>;

export type AddAuthorityEfficiencyResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["AddAuthorityEfficiency"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
  identityChainId?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  efficiency?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
}>;

export type AddAuthorityFactoidAddressResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["AddAuthorityFactoidAddress"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
  identityChainId?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  rcdHash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  factoidAddress?: Resolver<
    ResolversTypes["PublicFactoidAddress"],
    ParentType,
    ContextType
  >;
}>;

export type AddFederatedServerBitcoinAnchorKeyResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["AddFederatedServerBitcoinAnchorKey"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
  identityChainId?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  keyPriority?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  keyType?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ecdsaPublicKey?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type AddFederatedServerSigningKeyResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["AddFederatedServerSigningKey"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
  identityChainId?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  keyPriority?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  publicKey?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  directoryBlockHeight?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType
  >;
}>;

export type AddRemoveServerResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["AddRemoveServer"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
  identityChainId?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  directoryBlockHeight?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType
  >;
}>;

export type AdminBlockResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["AdminBlock"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  prevBlock?: Resolver<
    Maybe<ResolversTypes["AdminBlock"]>,
    ParentType,
    ContextType
  >;
  nextBlock?: Resolver<
    Maybe<ResolversTypes["AdminBlock"]>,
    ParentType,
    ContextType
  >;
  entries?: Resolver<
    Array<ResolversTypes["AdminEntry"]>,
    ParentType,
    ContextType
  >;
  directoryBlock?: Resolver<
    ResolversTypes["DirectoryBlock"],
    ParentType,
    ContextType
  >;
}>;

export type AdminEntryResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["AdminEntry"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "DirectoryBlockSignature"
    | "MatryoshkaHash"
    | "IncreaseServerCount"
    | "AddRemoveServer"
    | "AddFederatedServerSigningKey"
    | "AddFederatedServerBitcoinAnchorKey"
    | "ServerFaultHandoff"
    | "CoinbaseDescriptor"
    | "CoinbaseDescriptorCancel"
    | "AddAuthorityFactoidAddress"
    | "AddAuthorityEfficiency",
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
}>;

export type BlockResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Block"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AdminBlock"
    | "DirectoryBlock"
    | "EntryBlock"
    | "EntryCreditBlock"
    | "FactoidBlock",
    ParentType,
    ContextType
  >;
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
}>;

export type CoinbaseDescriptorResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["CoinbaseDescriptor"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
  outputs?: Resolver<
    Array<ResolversTypes["CoinbaseDescriptorOutput"]>,
    ParentType,
    ContextType
  >;
}>;

export type CoinbaseDescriptorCancelResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["CoinbaseDescriptorCancel"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
  descriptorHeight?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  descriptorIndex?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
}>;

export type CoinbaseDescriptorOutputResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["CoinbaseDescriptorOutput"]
> = ResolversObject<{
  address?: Resolver<
    ResolversTypes["PublicFactoidAddress"],
    ParentType,
    ContextType
  >;
  rcdHash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
}>;

export type CommitResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Commit"]
> = ResolversObject<{
  timestamp?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  entryHash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  entry?: Resolver<Maybe<ResolversTypes["Entry"]>, ParentType, ContextType>;
  credits?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  paymentAddress?: Resolver<
    ResolversTypes["PublicEntryCreditAddress"],
    ParentType,
    ContextType
  >;
  block?: Resolver<ResolversTypes["EntryCreditBlock"], ParentType, ContextType>;
}>;

export type CommitRevealSendResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["CommitRevealSend"]
> = ResolversObject<{
  entryHash?: Resolver<Maybe<ResolversTypes["Hash"]>, ParentType, ContextType>;
  transactionHash?: Resolver<
    Maybe<ResolversTypes["Hash"]>,
    ParentType,
    ContextType
  >;
  chain?: Resolver<Maybe<ResolversTypes["Hash"]>, ParentType, ContextType>;
}>;

export type CurrentMinuteResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["CurrentMinute"]
> = ResolversObject<{
  leaderHeight?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  directoryBlockHeight?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType
  >;
  minute?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  currentBlockStartTime?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType
  >;
  currentMinuteStartTime?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType
  >;
  currentTime?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  directoryBlockInSeconds?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType
  >;
  stallDetected?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  faultTimeout?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  roundTimeout?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
}>;

export type DirectoryBlockResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["DirectoryBlock"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  prevBlock?: Resolver<
    Maybe<ResolversTypes["DirectoryBlock"]>,
    ParentType,
    ContextType
  >;
  nextBlock?: Resolver<
    Maybe<ResolversTypes["DirectoryBlock"]>,
    ParentType,
    ContextType
  >;
  height?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  adminBlock?: Resolver<ResolversTypes["AdminBlock"], ParentType, ContextType>;
  entryBlocks?: Resolver<
    ResolversTypes["PaginatedEntryBlocks"],
    ParentType,
    ContextType,
    DirectoryBlockEntryBlocksArgs
  >;
  entryCreditBlock?: Resolver<
    ResolversTypes["EntryCreditBlock"],
    ParentType,
    ContextType
  >;
  factoidBlock?: Resolver<
    ResolversTypes["FactoidBlock"],
    ParentType,
    ContextType
  >;
}>;

export type DirectoryBlockSignatureResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["DirectoryBlockSignature"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
  identityChainId?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  previousDirectoryBlockSignature?: Resolver<
    Maybe<ResolversTypes["PreviousDirectoryBlockSignature"]>,
    ParentType,
    ContextType
  >;
}>;

export type EntryResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Entry"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  externalIds?: Resolver<
    Array<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  content?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["EntryBlock"], ParentType, ContextType>;
}>;

export type EntryBlockResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["EntryBlock"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  prevBlock?: Resolver<
    Maybe<ResolversTypes["EntryBlock"]>,
    ParentType,
    ContextType
  >;
  nextBlock?: Resolver<
    Maybe<ResolversTypes["EntryBlock"]>,
    ParentType,
    ContextType
  >;
  chain?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  height?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  entries?: Resolver<
    ResolversTypes["PaginatedEntries"],
    ParentType,
    ContextType,
    EntryBlockEntriesArgs
  >;
  directoryBlock?: Resolver<
    ResolversTypes["DirectoryBlock"],
    ParentType,
    ContextType
  >;
}>;

export type EntryCommitAckResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["EntryCommitAck"]
> = ResolversObject<{
  commitHash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  commitStatus?: Resolver<ResolversTypes["Ack"], ParentType, ContextType>;
  entryHash?: Resolver<Maybe<ResolversTypes["Hash"]>, ParentType, ContextType>;
  entryStatus?: Resolver<ResolversTypes["Ack"], ParentType, ContextType>;
}>;

export type EntryCreditAddressResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["EntryCreditAddress"]
> = ResolversObject<{
  amount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  publicAddress?: Resolver<
    ResolversTypes["PublicEntryCreditAddress"],
    ParentType,
    ContextType
  >;
  address?: Resolver<Maybe<ResolversTypes["Hash"]>, ParentType, ContextType>;
}>;

export type EntryCreditBlockResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["EntryCreditBlock"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  prevBlock?: Resolver<
    Maybe<ResolversTypes["EntryCreditBlock"]>,
    ParentType,
    ContextType
  >;
  nextBlock?: Resolver<
    Maybe<ResolversTypes["EntryCreditBlock"]>,
    ParentType,
    ContextType
  >;
  commits?: Resolver<
    ResolversTypes["PaginatedCommits"],
    ParentType,
    ContextType,
    EntryCreditBlockCommitsArgs
  >;
  directoryBlock?: Resolver<
    ResolversTypes["DirectoryBlock"],
    ParentType,
    ContextType
  >;
}>;

export type FactoidAddressResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["FactoidAddress"]
> = ResolversObject<{
  amount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  publicAddress?: Resolver<
    ResolversTypes["PublicFactoidAddress"],
    ParentType,
    ContextType
  >;
  address?: Resolver<Maybe<ResolversTypes["Hash"]>, ParentType, ContextType>;
}>;

export type FactoidBlockResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["FactoidBlock"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  prevBlock?: Resolver<
    Maybe<ResolversTypes["FactoidBlock"]>,
    ParentType,
    ContextType
  >;
  nextBlock?: Resolver<
    Maybe<ResolversTypes["FactoidBlock"]>,
    ParentType,
    ContextType
  >;
  entryCreditRate?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  transactions?: Resolver<
    ResolversTypes["PaginatedTransactions"],
    ParentType,
    ContextType,
    FactoidBlockTransactionsArgs
  >;
  directoryBlock?: Resolver<
    ResolversTypes["DirectoryBlock"],
    ParentType,
    ContextType
  >;
}>;

export type FactoidTransactionAckResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["FactoidTransactionAck"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  txTimestamp?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  txDate?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  blockTimestamp?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  blockDate?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Ack"], ParentType, ContextType>;
}>;

export interface HashScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Hash"], any> {
  name: "Hash";
}

export type HeightsResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Heights"]
> = ResolversObject<{
  leaderHeight?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  directoryBlockHeight?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType
  >;
  entryBlockHeight?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  entryHeight?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
}>;

export type IncreaseServerCountResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["IncreaseServerCount"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
}>;

export type MatryoshkaHashResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["MatryoshkaHash"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
  identityChainId?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  matryoshkaHash?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type MerkleNodeResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["MerkleNode"]
> = ResolversObject<{
  left?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  right?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  top?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Mutation"]
> = ResolversObject<{
  commitChain?: Resolver<
    ResolversTypes["CommitRevealSend"],
    ParentType,
    ContextType
  >;
  commitEntry?: Resolver<
    ResolversTypes["CommitRevealSend"],
    ParentType,
    ContextType
  >;
  revealChain?: Resolver<
    ResolversTypes["CommitRevealSend"],
    ParentType,
    ContextType
  >;
  revealEntry?: Resolver<
    ResolversTypes["CommitRevealSend"],
    ParentType,
    ContextType
  >;
  sendFactoids?: Resolver<
    ResolversTypes["CommitRevealSend"],
    ParentType,
    ContextType
  >;
}>;

export type PaginatedResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Paginated"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "PaginatedEntryBlocks"
    | "PaginatedEntries"
    | "PaginatedCommits"
    | "PaginatedTransactions"
    | "PaginatedPendingEntries"
    | "PaginatedPendingTransactions",
    ParentType,
    ContextType
  >;
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
}>;

export type PaginatedCommitsResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PaginatedCommits"]
> = ResolversObject<{
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  commits?: Resolver<Array<ResolversTypes["Commit"]>, ParentType, ContextType>;
}>;

export type PaginatedEntriesResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PaginatedEntries"]
> = ResolversObject<{
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  entries?: Resolver<Array<ResolversTypes["Entry"]>, ParentType, ContextType>;
}>;

export type PaginatedEntryBlocksResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PaginatedEntryBlocks"]
> = ResolversObject<{
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  entryBlocks?: Resolver<
    Array<ResolversTypes["EntryBlock"]>,
    ParentType,
    ContextType
  >;
}>;

export type PaginatedPendingEntriesResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PaginatedPendingEntries"]
> = ResolversObject<{
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  pendingEntries?: Resolver<
    Array<ResolversTypes["PendingEntry"]>,
    ParentType,
    ContextType
  >;
}>;

export type PaginatedPendingTransactionsResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PaginatedPendingTransactions"]
> = ResolversObject<{
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  pendingTransactions?: Resolver<
    Array<ResolversTypes["PendingTransaction"]>,
    ParentType,
    ContextType
  >;
}>;

export type PaginatedTransactionsResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PaginatedTransactions"]
> = ResolversObject<{
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  transactions?: Resolver<
    Array<ResolversTypes["Transaction"]>,
    ParentType,
    ContextType
  >;
}>;

export type PendingEntryResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PendingEntry"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Ack"], ParentType, ContextType>;
  chain?: Resolver<Maybe<ResolversTypes["Hash"]>, ParentType, ContextType>;
}>;

export type PendingTransactionResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PendingTransaction"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Ack"], ParentType, ContextType>;
  inputs?: Resolver<
    Array<ResolversTypes["FactoidAddress"]>,
    ParentType,
    ContextType
  >;
  factoidOutputs?: Resolver<
    Array<ResolversTypes["FactoidAddress"]>,
    ParentType,
    ContextType
  >;
  entryCreditOutputs?: Resolver<
    Array<ResolversTypes["EntryCreditAddress"]>,
    ParentType,
    ContextType
  >;
  totalInputs?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  totalFactoidOutputs?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType
  >;
  totalEntryCreditOutputs?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType
  >;
  fees?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
}>;

export type PreviousDirectoryBlockSignatureResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PreviousDirectoryBlockSignature"]
> = ResolversObject<{
  publicKey?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  signature?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type PropertiesResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Properties"]
> = ResolversObject<{
  factomdVersion?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  factomdApiVersion?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  graphQLApiVersion?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
}>;

export interface PublicEntryCreditAddressScalarConfig
  extends GraphQLScalarTypeConfig<
    ResolversTypes["PublicEntryCreditAddress"],
    any
  > {
  name: "PublicEntryCreditAddress";
}

export interface PublicFactoidAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["PublicFactoidAddress"], any> {
  name: "PublicFactoidAddress";
}

export type QueryResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Query"]
> = ResolversObject<{
  adminBlock?: Resolver<
    Maybe<ResolversTypes["AdminBlock"]>,
    ParentType,
    ContextType,
    QueryAdminBlockArgs
  >;
  adminBlockByHeight?: Resolver<
    Maybe<ResolversTypes["AdminBlock"]>,
    ParentType,
    ContextType,
    QueryAdminBlockByHeightArgs
  >;
  adminBlockHead?: Resolver<
    Maybe<ResolversTypes["AdminBlock"]>,
    ParentType,
    ContextType
  >;
  chainHead?: Resolver<
    Maybe<ResolversTypes["EntryBlock"]>,
    ParentType,
    ContextType,
    QueryChainHeadArgs
  >;
  currentMinute?: Resolver<
    ResolversTypes["CurrentMinute"],
    ParentType,
    ContextType
  >;
  directoryBlock?: Resolver<
    Maybe<ResolversTypes["DirectoryBlock"]>,
    ParentType,
    ContextType,
    QueryDirectoryBlockArgs
  >;
  directoryBlockByHeight?: Resolver<
    Maybe<ResolversTypes["DirectoryBlock"]>,
    ParentType,
    ContextType,
    QueryDirectoryBlockByHeightArgs
  >;
  directoryBlockHead?: Resolver<
    Maybe<ResolversTypes["DirectoryBlock"]>,
    ParentType,
    ContextType
  >;
  entry?: Resolver<
    Maybe<ResolversTypes["Entry"]>,
    ParentType,
    ContextType,
    QueryEntryArgs
  >;
  entryBlock?: Resolver<
    Maybe<ResolversTypes["EntryBlock"]>,
    ParentType,
    ContextType,
    QueryEntryBlockArgs
  >;
  entryCommitAck?: Resolver<
    ResolversTypes["EntryCommitAck"],
    ParentType,
    ContextType,
    QueryEntryCommitAckArgs
  >;
  entryCreditBalance?: Resolver<
    ResolversTypes["EntryCreditAddress"],
    ParentType,
    ContextType,
    QueryEntryCreditBalanceArgs
  >;
  entryCreditBlock?: Resolver<
    Maybe<ResolversTypes["EntryCreditBlock"]>,
    ParentType,
    ContextType,
    QueryEntryCreditBlockArgs
  >;
  entryCreditBlockByHeight?: Resolver<
    Maybe<ResolversTypes["EntryCreditBlock"]>,
    ParentType,
    ContextType,
    QueryEntryCreditBlockByHeightArgs
  >;
  entryCreditBlockHead?: Resolver<
    Maybe<ResolversTypes["EntryCreditBlock"]>,
    ParentType,
    ContextType
  >;
  entryCreditRate?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  factoidBalance?: Resolver<
    ResolversTypes["FactoidAddress"],
    ParentType,
    ContextType,
    QueryFactoidBalanceArgs
  >;
  factoidBlock?: Resolver<
    Maybe<ResolversTypes["FactoidBlock"]>,
    ParentType,
    ContextType,
    QueryFactoidBlockArgs
  >;
  factoidBlockByHeight?: Resolver<
    Maybe<ResolversTypes["FactoidBlock"]>,
    ParentType,
    ContextType,
    QueryFactoidBlockByHeightArgs
  >;
  factoidBlockHead?: Resolver<
    Maybe<ResolversTypes["FactoidBlock"]>,
    ParentType,
    ContextType
  >;
  factoidTransactionAck?: Resolver<
    ResolversTypes["FactoidTransactionAck"],
    ParentType,
    ContextType,
    QueryFactoidTransactionAckArgs
  >;
  heights?: Resolver<ResolversTypes["Heights"], ParentType, ContextType>;
  pendingEntries?: Resolver<
    ResolversTypes["PaginatedPendingEntries"],
    ParentType,
    ContextType
  >;
  pendingTransactions?: Resolver<
    ResolversTypes["PaginatedPendingTransactions"],
    ParentType,
    ContextType
  >;
  properties?: Resolver<ResolversTypes["Properties"], ParentType, ContextType>;
  receipt?: Resolver<
    Maybe<ResolversTypes["Receipt"]>,
    ParentType,
    ContextType,
    QueryReceiptArgs
  >;
  transaction?: Resolver<
    Maybe<ResolversTypes["Transaction"]>,
    ParentType,
    ContextType,
    QueryTransactionArgs
  >;
}>;

export type ReceiptResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Receipt"]
> = ResolversObject<{
  entry?: Resolver<ResolversTypes["Entry"], ParentType, ContextType>;
  entryBlock?: Resolver<ResolversTypes["EntryBlock"], ParentType, ContextType>;
  directoryBlock?: Resolver<
    ResolversTypes["DirectoryBlock"],
    ParentType,
    ContextType
  >;
  bitcoinTransactionHash?: Resolver<
    ResolversTypes["Hash"],
    ParentType,
    ContextType
  >;
  bitcoinBlockHash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  merkleBranch?: Resolver<
    Array<ResolversTypes["MerkleNode"]>,
    ParentType,
    ContextType
  >;
}>;

export type ServerFaultHandoffResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["ServerFaultHandoff"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["AdminCode"], ParentType, ContextType>;
}>;

export type SubscriptionResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Subscription"]
> = ResolversObject<{
  newAdminBlock?: SubscriptionResolver<
    ResolversTypes["AdminBlock"],
    ParentType,
    ContextType
  >;
  newChainsCreated?: SubscriptionResolver<
    Array<ResolversTypes["PaginatedEntryBlocks"]>,
    ParentType,
    ContextType
  >;
  newDirectoryBlock?: SubscriptionResolver<
    ResolversTypes["DirectoryBlock"],
    ParentType,
    ContextType
  >;
  newEntryBlock?: SubscriptionResolver<
    ResolversTypes["EntryBlock"],
    ParentType,
    ContextType,
    SubscriptionNewEntryBlockArgs
  >;
  newEntryCreditBlock?: SubscriptionResolver<
    ResolversTypes["EntryCreditBlock"],
    ParentType,
    ContextType
  >;
  newFactoidBlock?: SubscriptionResolver<
    ResolversTypes["FactoidBlock"],
    ParentType,
    ContextType
  >;
}>;

export type TransactionResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Transaction"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  inputs?: Resolver<
    Array<ResolversTypes["FactoidAddress"]>,
    ParentType,
    ContextType
  >;
  factoidOutputs?: Resolver<
    Array<ResolversTypes["FactoidAddress"]>,
    ParentType,
    ContextType
  >;
  entryCreditOutputs?: Resolver<
    Array<ResolversTypes["EntryCreditAddress"]>,
    ParentType,
    ContextType
  >;
  totalInputs?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  totalFactoidOutputs?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType
  >;
  totalEntryCreditOutputs?: Resolver<
    ResolversTypes["Int"],
    ParentType,
    ContextType
  >;
  fees?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  block?: Resolver<ResolversTypes["FactoidBlock"], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AddAuthorityEfficiency?: AddAuthorityEfficiencyResolvers<ContextType>;
  AddAuthorityFactoidAddress?: AddAuthorityFactoidAddressResolvers<ContextType>;
  AddFederatedServerBitcoinAnchorKey?: AddFederatedServerBitcoinAnchorKeyResolvers<
    ContextType
  >;
  AddFederatedServerSigningKey?: AddFederatedServerSigningKeyResolvers<
    ContextType
  >;
  AddRemoveServer?: AddRemoveServerResolvers<ContextType>;
  AdminBlock?: AdminBlockResolvers<ContextType>;
  AdminEntry?: AdminEntryResolvers;
  Block?: BlockResolvers;
  CoinbaseDescriptor?: CoinbaseDescriptorResolvers<ContextType>;
  CoinbaseDescriptorCancel?: CoinbaseDescriptorCancelResolvers<ContextType>;
  CoinbaseDescriptorOutput?: CoinbaseDescriptorOutputResolvers<ContextType>;
  Commit?: CommitResolvers<ContextType>;
  CommitRevealSend?: CommitRevealSendResolvers<ContextType>;
  CurrentMinute?: CurrentMinuteResolvers<ContextType>;
  DirectoryBlock?: DirectoryBlockResolvers<ContextType>;
  DirectoryBlockSignature?: DirectoryBlockSignatureResolvers<ContextType>;
  Entry?: EntryResolvers<ContextType>;
  EntryBlock?: EntryBlockResolvers<ContextType>;
  EntryCommitAck?: EntryCommitAckResolvers<ContextType>;
  EntryCreditAddress?: EntryCreditAddressResolvers<ContextType>;
  EntryCreditBlock?: EntryCreditBlockResolvers<ContextType>;
  FactoidAddress?: FactoidAddressResolvers<ContextType>;
  FactoidBlock?: FactoidBlockResolvers<ContextType>;
  FactoidTransactionAck?: FactoidTransactionAckResolvers<ContextType>;
  Hash?: GraphQLScalarType;
  Heights?: HeightsResolvers<ContextType>;
  IncreaseServerCount?: IncreaseServerCountResolvers<ContextType>;
  MatryoshkaHash?: MatryoshkaHashResolvers<ContextType>;
  MerkleNode?: MerkleNodeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Paginated?: PaginatedResolvers;
  PaginatedCommits?: PaginatedCommitsResolvers<ContextType>;
  PaginatedEntries?: PaginatedEntriesResolvers<ContextType>;
  PaginatedEntryBlocks?: PaginatedEntryBlocksResolvers<ContextType>;
  PaginatedPendingEntries?: PaginatedPendingEntriesResolvers<ContextType>;
  PaginatedPendingTransactions?: PaginatedPendingTransactionsResolvers<
    ContextType
  >;
  PaginatedTransactions?: PaginatedTransactionsResolvers<ContextType>;
  PendingEntry?: PendingEntryResolvers<ContextType>;
  PendingTransaction?: PendingTransactionResolvers<ContextType>;
  PreviousDirectoryBlockSignature?: PreviousDirectoryBlockSignatureResolvers<
    ContextType
  >;
  Properties?: PropertiesResolvers<ContextType>;
  PublicEntryCreditAddress?: GraphQLScalarType;
  PublicFactoidAddress?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Receipt?: ReceiptResolvers<ContextType>;
  ServerFaultHandoff?: ServerFaultHandoffResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
