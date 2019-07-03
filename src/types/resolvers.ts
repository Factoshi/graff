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
  /** Block height must be a positive integer. */
  Height: number;
  /** Public entry credit address. */
  PublicEntryCreditAddress: string;
  /** Any public address */
  PublicAddress: any;
  /** Public factoid address. */
  PublicFactoidAddress: string;
};

/** Possible states of a ledger entry. */
export enum Ack {
  /** Found in the blockchain. */
  DBlockConfirmed = "DBlockConfirmed",
  /** Found on local node but not on the network. */
  NotConfirmed = "NotConfirmed",
  /** Found on the network but not yet in the blockchain. */
  TransactionAck = "TransactionACK",
  /** Not found anywhere. */
  Unknown = "Unknown"
}

export type AckStatus = {
  __typename?: "AckStatus";
  timestamp?: Maybe<Scalars["Float"]>;
  status: Ack;
};

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
  directoryBlockHeight: Scalars["Height"];
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
  directoryBlockHeight: Scalars["Height"];
};

/** Public address and associated amount. */
export type Address = {
  __typename?: "Address";
  /** Amount may be balance or output value, depending on the context. */
  amount: Scalars["Int"];
  /** Public address. */
  address: Scalars["PublicAddress"];
};

/** Admin Block */
export type AdminBlock = {
  __typename?: "AdminBlock";
  /** The hash of the current block. */
  hash: Scalars["Hash"];
  /** Block height. */
  height: Scalars["Height"];
  /** The previous block. */
  previousBlock?: Maybe<AdminBlock>;
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
  descriptorHeight: Scalars["Height"];
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
  /** The entry that was committed. All fields except hash will be null if not yet revealed. */
  entry: Entry;
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
  leaderHeight: Scalars["Height"];
  /** The highest saved directory block height of the factomd API server. */
  directoryBlockHeight: Scalars["Height"];
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
export type DirectoryBlock = {
  __typename?: "DirectoryBlock";
  /** The hash of the current block. */
  hash: Scalars["Hash"];
  /** The previous block. */
  previousBlock?: Maybe<DirectoryBlock>;
  /** The next block. */
  nextBlock?: Maybe<DirectoryBlock>;
  /** Block height. */
  height: Scalars["Height"];
  /** Milliseconds since Unix epoch. Marks the start of the block. */
  timestamp: Scalars["Float"];
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

/** An Entry. Fields may be null if the entry has not yet been revealed. */
export type Entry = {
  __typename?: "Entry";
  /** The hash of the entry */
  hash: Scalars["Hash"];
  /** The chain the entry belongs to. */
  chain?: Maybe<Scalars["Hash"]>;
  /** The timestamp of the entry. */
  timestamp?: Maybe<Scalars["Float"]>;
  /** List of external IDs associated with the entry as base64. */
  externalIds?: Maybe<Array<Scalars["String"]>>;
  /** The content of the entry as base64. */
  content?: Maybe<Scalars["String"]>;
  /** The parent entry block of the entry. */
  entryBlock?: Maybe<EntryBlock>;
};

/** Entry Block */
export type EntryBlock = {
  __typename?: "EntryBlock";
  /** The hash of the current block. */
  hash: Scalars["Hash"];
  /** The previous block. */
  previousBlock?: Maybe<EntryBlock>;
  /** The ID of the parent chain. */
  chain: Scalars["Hash"];
  /** Height of entry block. Also known as sequence number. */
  height: Scalars["Height"];
  /** Milliseconds since Unix epoch. Marks the start of the block. */
  timestamp: Scalars["Float"];
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
  /** The hash of the entry. May be null if the commit has not yet been revealed. */
  entryHash?: Maybe<Scalars["Hash"]>;
  /** The status of the commit. */
  commitStatus: AckStatus;
  /** The status of the entry. */
  entryStatus?: Maybe<AckStatus>;
};

/** Entry Credit Block */
export type EntryCreditBlock = {
  __typename?: "EntryCreditBlock";
  /** The hash of the current block. */
  hash: Scalars["Hash"];
  /** Block height. */
  height: Scalars["Height"];
  /** The previous block. */
  previousBlock?: Maybe<EntryCreditBlock>;
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

/** Factoid Block */
export type FactoidBlock = {
  __typename?: "FactoidBlock";
  /** The hash of the current block. */
  hash: Scalars["Hash"];
  /** Block height. */
  height: Scalars["Height"];
  /** The previous block. */
  previousBlock?: Maybe<FactoidBlock>;
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
  txTimestamp?: Maybe<Scalars["Float"]>;
  /** The timestamp of the containing block. Milliseconds since Unix epoch. */
  blockTimestamp?: Maybe<Scalars["Float"]>;
  /** The status of the factoid transaction */
  status: Ack;
};

/** Network and server heights. */
export type Heights = {
  __typename?: "Heights";
  /** The current block height. */
  leaderHeight: Scalars["Height"];
  /** The highest saved directory block height of the factomd API server. */
  directoryBlockHeight: Scalars["Height"];
  /** The height at which the factomd API server has all the entry blocks. */
  entryBlockHeight: Scalars["Height"];
  /** The height at which the local factomd API server has all the entries. */
  entryHeight: Scalars["Height"];
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

/** Basic pagination interface. */
export type Paginated = {
  __typename?: "Paginated";
  /** Total number of nodes available for pagination. */
  totalCount: Scalars["Int"];
  /** Position to offset from beginning of list */
  offset: Scalars["Int"];
  /** Get pageLength x in list following offset */
  pageLength: Scalars["Int"];
};

/** Paginated commits */
export type PaginatedCommits = Paginated & {
  __typename?: "PaginatedCommits";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** Position to offset from beginning of list */
  offset: Scalars["Int"];
  /** Get pageLength x in list following offset */
  pageLength: Scalars["Int"];
  /** An array of commits. */
  commits: Array<Commit>;
};

/** Paginated entries */
export type PaginatedEntries = Paginated & {
  __typename?: "PaginatedEntries";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** Position to offset from beginning of list */
  offset: Scalars["Int"];
  /** Get pageLength x in list following offset */
  pageLength: Scalars["Int"];
  /** An array of entries. */
  entries: Array<Entry>;
};

/** Paginated entry blocks */
export type PaginatedEntryBlocks = Paginated & {
  __typename?: "PaginatedEntryBlocks";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** Position to offset from beginning of list */
  offset: Scalars["Int"];
  /** Get pageLength x in list following offset */
  pageLength: Scalars["Int"];
  /** An array of entry blocks. */
  entryBlocks: Array<EntryBlock>;
};

/** Paginated pending entries */
export type PaginatedPendingEntries = Paginated & {
  __typename?: "PaginatedPendingEntries";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** Position to offset from beginning of list */
  offset: Scalars["Int"];
  /** Get pageLength x in list following offset */
  pageLength: Scalars["Int"];
  /** An array of pending entries. */
  pendingEntries: Array<PendingEntry>;
};

/** Paginated pending transactions */
export type PaginatedPendingTransactions = Paginated & {
  __typename?: "PaginatedPendingTransactions";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** Position to offset from beginning of list */
  offset: Scalars["Int"];
  /** Get pageLength x in list following offset */
  pageLength: Scalars["Int"];
  /** An array of pending transactions. */
  pendingTransactions: Array<PendingTransaction>;
};

/** Paginated transactions */
export type PaginatedTransactions = Paginated & {
  __typename?: "PaginatedTransactions";
  /** Total number of nodes within pages. */
  totalCount: Scalars["Int"];
  /** Position to offset from beginning of list */
  offset: Scalars["Int"];
  /** Get pageLength x in list following offset */
  pageLength: Scalars["Int"];
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
  inputs: Array<Address>;
  /** An array of factoid outputs */
  factoidOutputs: Array<Address>;
  /** An array of entry credit outputs. */
  entryCreditOutputs: Array<Address>;
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

/** Factomd and API properties. */
export type Properties = {
  __typename?: "Properties";
  /** The version of the factomd API server. */
  factomdVersion: Scalars["String"];
  /** The version of the factomd API. */
  factomdAPIVersion: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  /** Get an admin block by the specified block hash. */
  adminBlock?: Maybe<AdminBlock>;
  /** Get an admin block by the specified block height. */
  adminBlockByHeight?: Maybe<AdminBlock>;
  /** Get the admin block at the tip of the admin chain. */
  adminBlockHead: AdminBlock;
  /** Get the balance of public entry credit or factoid addresses. */
  balances: Array<Address>;
  /** Get the entry block at the tip of the specified chain. */
  chainHead?: Maybe<EntryBlock>;
  /** Entry status. */
  commitAck: EntryCommitAck;
  /** Get protocol time state. */
  currentMinute: CurrentMinute;
  /** Get a directory block by the specified block hash. */
  directoryBlock?: Maybe<DirectoryBlock>;
  /** Get a directory block by the specified block height. */
  directoryBlockByHeight?: Maybe<DirectoryBlock>;
  /** Get the directory block at the tip of the directory chain. */
  directoryBlockHead: DirectoryBlock;
  /** Get an entry by its hash. */
  entry?: Maybe<Entry>;
  /** Entry status. */
  entryAck: EntryCommitAck;
  /** Get an entry block by the specified block hash. */
  entryBlock?: Maybe<EntryBlock>;
  /** Get an entry credit block by the specified block hash. */
  entryCreditBlock?: Maybe<EntryCreditBlock>;
  /** Get an entry credit block by the specified block height. */
  entryCreditBlockByHeight?: Maybe<EntryCreditBlock>;
  /** Get the entry credit block at the tip of the entry credit chain. */
  entryCreditBlockHead: EntryCreditBlock;
  /** Get the EC-FCT exchange rate. */
  entryCreditRate: Scalars["Int"];
  /** Get a factoid block by the specified block hash. */
  factoidBlock?: Maybe<FactoidBlock>;
  /** Get a factoid block by the specified block hash. */
  factoidBlockByHeight?: Maybe<FactoidBlock>;
  /** Get the factoid block at the tip of the factoid chain. */
  factoidBlockHead: FactoidBlock;
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
  height: Scalars["Height"];
};

export type QueryBalancesArgs = {
  addresses: Array<Scalars["PublicAddress"]>;
};

export type QueryChainHeadArgs = {
  chain: Scalars["Hash"];
};

export type QueryCommitAckArgs = {
  hash: Scalars["Hash"];
};

export type QueryDirectoryBlockArgs = {
  hash: Scalars["Hash"];
};

export type QueryDirectoryBlockByHeightArgs = {
  height: Scalars["Height"];
};

export type QueryEntryArgs = {
  hash: Scalars["Hash"];
};

export type QueryEntryAckArgs = {
  hash: Scalars["Hash"];
  chain: Scalars["Hash"];
};

export type QueryEntryBlockArgs = {
  hash: Scalars["Hash"];
};

export type QueryEntryCreditBlockArgs = {
  hash: Scalars["Hash"];
};

export type QueryEntryCreditBlockByHeightArgs = {
  height: Scalars["Height"];
};

export type QueryFactoidBlockArgs = {
  hash: Scalars["Hash"];
};

export type QueryFactoidBlockByHeightArgs = {
  height: Scalars["Height"];
};

export type QueryFactoidTransactionAckArgs = {
  hash: Scalars["Hash"];
};

export type QueryPendingEntriesArgs = {
  first?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
};

export type QueryPendingTransactionsArgs = {
  first?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
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
  /** The hash of the bitcoin transaction that anchored this entry into Bitcoin. */
  bitcoinTransactionHash?: Maybe<Scalars["Hash"]>;
  /** The bitcoin block where the anchored transaction was included. */
  bitcoinBlockHash?: Maybe<Scalars["Hash"]>;
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

/** Factoid Transaction included in the blockchain. */
export type Transaction = {
  __typename?: "Transaction";
  /** The transaction hash. Also known as the transaction ID. */
  hash: Scalars["Hash"];
  /** Milliseconds since Unix epoch. */
  timestamp: Scalars["Float"];
  /** An array of factoid inputs. */
  inputs: Array<Address>;
  /** An array of factoid outputs */
  factoidOutputs: Array<Address>;
  /** An array of entry credit outputs. */
  entryCreditOutputs: Array<Address>;
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
  Height: Partial<Scalars["Height"]>;
  AdminEntry: Partial<AdminEntry>;
  Int: Partial<Scalars["Int"]>;
  AdminCode: Partial<AdminCode>;
  DirectoryBlock: Partial<DirectoryBlock>;
  Float: Partial<Scalars["Float"]>;
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
  Address: Partial<Address>;
  PublicAddress: Partial<Scalars["PublicAddress"]>;
  EntryCommitAck: Partial<EntryCommitAck>;
  AckStatus: Partial<AckStatus>;
  Ack: Partial<Ack>;
  CurrentMinute: Partial<CurrentMinute>;
  Boolean: Partial<Scalars["Boolean"]>;
  FactoidTransactionAck: Partial<FactoidTransactionAck>;
  Heights: Partial<Heights>;
  PaginatedPendingEntries: Partial<PaginatedPendingEntries>;
  PendingEntry: Partial<PendingEntry>;
  PaginatedPendingTransactions: Partial<PaginatedPendingTransactions>;
  PendingTransaction: Partial<PendingTransaction>;
  Properties: Partial<Properties>;
  Receipt: Partial<Receipt>;
  MerkleNode: Partial<MerkleNode>;
  PublicFactoidAddress: Partial<Scalars["PublicFactoidAddress"]>;
  CommitRevealSend: Partial<CommitRevealSend>;
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

export type AckStatusResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["AckStatus"]
> = ResolversObject<{
  timestamp?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Ack"], ParentType, ContextType>;
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
    ResolversTypes["Height"],
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
    ResolversTypes["Height"],
    ParentType,
    ContextType
  >;
}>;

export type AddressResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Address"]
> = ResolversObject<{
  amount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  address?: Resolver<ResolversTypes["PublicAddress"], ParentType, ContextType>;
}>;

export type AdminBlockResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["AdminBlock"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  height?: Resolver<ResolversTypes["Height"], ParentType, ContextType>;
  previousBlock?: Resolver<
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
  descriptorHeight?: Resolver<
    ResolversTypes["Height"],
    ParentType,
    ContextType
  >;
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
  entry?: Resolver<ResolversTypes["Entry"], ParentType, ContextType>;
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
  leaderHeight?: Resolver<ResolversTypes["Height"], ParentType, ContextType>;
  directoryBlockHeight?: Resolver<
    ResolversTypes["Height"],
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
  previousBlock?: Resolver<
    Maybe<ResolversTypes["DirectoryBlock"]>,
    ParentType,
    ContextType
  >;
  nextBlock?: Resolver<
    Maybe<ResolversTypes["DirectoryBlock"]>,
    ParentType,
    ContextType
  >;
  height?: Resolver<ResolversTypes["Height"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
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
  chain?: Resolver<Maybe<ResolversTypes["Hash"]>, ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  externalIds?: Resolver<
    Maybe<Array<ResolversTypes["String"]>>,
    ParentType,
    ContextType
  >;
  content?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  entryBlock?: Resolver<
    Maybe<ResolversTypes["EntryBlock"]>,
    ParentType,
    ContextType
  >;
}>;

export type EntryBlockResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["EntryBlock"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  previousBlock?: Resolver<
    Maybe<ResolversTypes["EntryBlock"]>,
    ParentType,
    ContextType
  >;
  chain?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  height?: Resolver<ResolversTypes["Height"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
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
  entryHash?: Resolver<Maybe<ResolversTypes["Hash"]>, ParentType, ContextType>;
  commitStatus?: Resolver<ResolversTypes["AckStatus"], ParentType, ContextType>;
  entryStatus?: Resolver<
    Maybe<ResolversTypes["AckStatus"]>,
    ParentType,
    ContextType
  >;
}>;

export type EntryCreditBlockResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["EntryCreditBlock"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  height?: Resolver<ResolversTypes["Height"], ParentType, ContextType>;
  previousBlock?: Resolver<
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

export type FactoidBlockResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["FactoidBlock"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  height?: Resolver<ResolversTypes["Height"], ParentType, ContextType>;
  previousBlock?: Resolver<
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
  txTimestamp?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  blockTimestamp?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Ack"], ParentType, ContextType>;
}>;

export interface HashScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Hash"], any> {
  name: "Hash";
}

export interface HeightScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Height"], any> {
  name: "Height";
}

export type HeightsResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Heights"]
> = ResolversObject<{
  leaderHeight?: Resolver<ResolversTypes["Height"], ParentType, ContextType>;
  directoryBlockHeight?: Resolver<
    ResolversTypes["Height"],
    ParentType,
    ContextType
  >;
  entryBlockHeight?: Resolver<
    ResolversTypes["Height"],
    ParentType,
    ContextType
  >;
  entryHeight?: Resolver<ResolversTypes["Height"], ParentType, ContextType>;
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
  offset?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  pageLength?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
}>;

export type PaginatedCommitsResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PaginatedCommits"]
> = ResolversObject<{
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  pageLength?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  commits?: Resolver<Array<ResolversTypes["Commit"]>, ParentType, ContextType>;
}>;

export type PaginatedEntriesResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PaginatedEntries"]
> = ResolversObject<{
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  pageLength?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  entries?: Resolver<Array<ResolversTypes["Entry"]>, ParentType, ContextType>;
}>;

export type PaginatedEntryBlocksResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PaginatedEntryBlocks"]
> = ResolversObject<{
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  pageLength?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
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
  offset?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  pageLength?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
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
  offset?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  pageLength?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
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
  offset?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  pageLength?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
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
  inputs?: Resolver<Array<ResolversTypes["Address"]>, ParentType, ContextType>;
  factoidOutputs?: Resolver<
    Array<ResolversTypes["Address"]>,
    ParentType,
    ContextType
  >;
  entryCreditOutputs?: Resolver<
    Array<ResolversTypes["Address"]>,
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
  factomdAPIVersion?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
}>;

export interface PublicAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["PublicAddress"], any> {
  name: "PublicAddress";
}

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
    ResolversTypes["AdminBlock"],
    ParentType,
    ContextType
  >;
  balances?: Resolver<
    Array<ResolversTypes["Address"]>,
    ParentType,
    ContextType,
    QueryBalancesArgs
  >;
  chainHead?: Resolver<
    Maybe<ResolversTypes["EntryBlock"]>,
    ParentType,
    ContextType,
    QueryChainHeadArgs
  >;
  commitAck?: Resolver<
    ResolversTypes["EntryCommitAck"],
    ParentType,
    ContextType,
    QueryCommitAckArgs
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
    ResolversTypes["DirectoryBlock"],
    ParentType,
    ContextType
  >;
  entry?: Resolver<
    Maybe<ResolversTypes["Entry"]>,
    ParentType,
    ContextType,
    QueryEntryArgs
  >;
  entryAck?: Resolver<
    ResolversTypes["EntryCommitAck"],
    ParentType,
    ContextType,
    QueryEntryAckArgs
  >;
  entryBlock?: Resolver<
    Maybe<ResolversTypes["EntryBlock"]>,
    ParentType,
    ContextType,
    QueryEntryBlockArgs
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
    ResolversTypes["EntryCreditBlock"],
    ParentType,
    ContextType
  >;
  entryCreditRate?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
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
    ResolversTypes["FactoidBlock"],
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
    ContextType,
    QueryPendingEntriesArgs
  >;
  pendingTransactions?: Resolver<
    ResolversTypes["PaginatedPendingTransactions"],
    ParentType,
    ContextType,
    QueryPendingTransactionsArgs
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
  bitcoinTransactionHash?: Resolver<
    Maybe<ResolversTypes["Hash"]>,
    ParentType,
    ContextType
  >;
  bitcoinBlockHash?: Resolver<
    Maybe<ResolversTypes["Hash"]>,
    ParentType,
    ContextType
  >;
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

export type TransactionResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Transaction"]
> = ResolversObject<{
  hash?: Resolver<ResolversTypes["Hash"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  inputs?: Resolver<Array<ResolversTypes["Address"]>, ParentType, ContextType>;
  factoidOutputs?: Resolver<
    Array<ResolversTypes["Address"]>,
    ParentType,
    ContextType
  >;
  entryCreditOutputs?: Resolver<
    Array<ResolversTypes["Address"]>,
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
  AckStatus?: AckStatusResolvers<ContextType>;
  AddAuthorityEfficiency?: AddAuthorityEfficiencyResolvers<ContextType>;
  AddAuthorityFactoidAddress?: AddAuthorityFactoidAddressResolvers<ContextType>;
  AddFederatedServerBitcoinAnchorKey?: AddFederatedServerBitcoinAnchorKeyResolvers<
    ContextType
  >;
  AddFederatedServerSigningKey?: AddFederatedServerSigningKeyResolvers<
    ContextType
  >;
  AddRemoveServer?: AddRemoveServerResolvers<ContextType>;
  Address?: AddressResolvers<ContextType>;
  AdminBlock?: AdminBlockResolvers<ContextType>;
  AdminEntry?: AdminEntryResolvers;
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
  EntryCreditBlock?: EntryCreditBlockResolvers<ContextType>;
  FactoidBlock?: FactoidBlockResolvers<ContextType>;
  FactoidTransactionAck?: FactoidTransactionAckResolvers<ContextType>;
  Hash?: GraphQLScalarType;
  Height?: GraphQLScalarType;
  Heights?: HeightsResolvers<ContextType>;
  IncreaseServerCount?: IncreaseServerCountResolvers<ContextType>;
  MatryoshkaHash?: MatryoshkaHashResolvers<ContextType>;
  MerkleNode?: MerkleNodeResolvers<ContextType>;
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
  PublicAddress?: GraphQLScalarType;
  PublicEntryCreditAddress?: GraphQLScalarType;
  PublicFactoidAddress?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Receipt?: ReceiptResolvers<ContextType>;
  ServerFaultHandoff?: ServerFaultHandoffResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
