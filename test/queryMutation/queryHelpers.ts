import gql from 'graphql-tag';

export const QUERY_ABLOCK = gql`
    query GetAdminBlock($hash: Hash!) {
        adminBlock(hash: $hash) {
            backReferenceHash
            lookupHash
            bodySize
            previousBlock {
                bodySize
            }
            nextBlock {
                lookupHash
            }
            directoryBlock {
                height
            }
            entries {
                ... on DirectoryBlockSignature {
                    id
                    code
                    previousDirectoryBlockSignature {
                        signature
                    }
                }
                ... on AddRemoveServer {
                    id
                    code
                    identityChainId
                    directoryBlockHeight
                }
                ... on MatryoshkaHash {
                    id
                    code
                    matryoshkaHash
                    identityChainId
                }
                ... on AddFederatedServerSigningKey {
                    id
                    code
                    identityChainId
                    keyPriority
                    publicKey
                    directoryBlockHeight
                }
                ... on AddFederatedServerBitcoinAnchorKey {
                    id
                    code
                    identityChainId
                    keyPriority
                    keyType
                    ecdsaPublicKey
                }
                ... on AddAuthorityFactoidAddress {
                    id
                    code
                    identityChainId
                    factoidAddress
                    rcdHash
                }
                ... on AddAuthorityEfficiency {
                    id
                    code
                    identityChainId
                    efficiency
                }
                ... on CoinbaseDescriptor {
                    id
                    code
                    outputs {
                        address
                        rcdHash
                        amount
                    }
                }
            }
        }
    }
`;

export const QUERY_ABLOCK_HEIGHT = gql`
    query GetAdminBlock($height: Height!) {
        adminBlockByHeight(height: $height) {
            backReferenceHash
            lookupHash
            bodySize
            previousBlock {
                bodySize
            }
            nextBlock {
                lookupHash
            }
            directoryBlock {
                height
            }
            entries {
                ... on CoinbaseDescriptor {
                    id
                    code
                    outputs {
                        address
                        rcdHash
                        amount
                    }
                }
            }
        }
    }
`;

export const QUERY_ABLOCK_HEAD = gql`
    query GetAdminBlockHead {
        adminBlockHead {
            backReferenceHash
            lookupHash
            bodySize
            previousBlock {
                bodySize
            }
            nextBlock {
                lookupHash
            }
            directoryBlock {
                height
            }
        }
    }
`;

export const QUERY_BALANCES = gql`
    query GetBalances($addresses: [PublicAddress!]!) {
        balances(addresses: $addresses) {
            amount
            address
        }
    }
`;

export const QUERY_CHAIN_HEAD = gql`
    query GetChainHead($chainId: Hash!) {
        chainHead(chainId: $chainId) {
            keyMR
            chainId
            sequenceNumber
            timestamp
            previousBlock {
                sequenceNumber
            }
            entryPage {
                entries {
                    content
                }
            }
            directoryBlock {
                height
            }
        }
    }
`;

export const QUERY_COMMIT_ACK = gql`
    query GetCommitAck($hash: Hash!) {
        commitAck(hash: $hash) {
            commitHash
            entryHash
            commitStatus {
                timestamp
                status
            }
            entryStatus {
                status
                timestamp
            }
        }
    }
`;

export const QUERY_CURRENT_MINUTE = gql`
    query GetCurrentMinute {
        currentMinute {
            leaderHeight
            directoryBlockHeight
            minute
            currentMinuteStartTime
            currentBlockStartTime
            currentTime
            directoryBlockInSeconds
            stallDetected
            faultTimeout
            roundTimeout
        }
    }
`;

export const QUERY_DBLOCK = gql`
    query GetDirectoryBlock($hash: Hash!) {
        directoryBlock(hash: $hash) {
            keyMR
            previousBlock {
                height
            }
            nextBlock {
                height
            }
            height
            timestamp
            adminBlock {
                lookupHash
            }
            entryBlockPage(first: 5, offset: 0) {
                entryBlocks {
                    chainId
                }
            }
            entryCreditBlock {
                fullHash
            }
            factoidBlock {
                bodyMR
            }
        }
    }
`;

export const QUERY_DBLOCK_HEIGHT = gql`
    query GetDirectoryBlockByHeight($height: Height!) {
        directoryBlockByHeight(height: $height) {
            keyMR
            previousBlock {
                height
            }
            nextBlock {
                height
            }
            height
            timestamp
            adminBlock {
                lookupHash
            }
            entryBlockPage(first: 5, offset: 0) {
                entryBlocks {
                    chainId
                }
            }
            entryCreditBlock {
                fullHash
            }
            factoidBlock {
                bodyMR
            }
        }
    }
`;

export const QUERY_DBLOCK_HEAD = gql`
    query GetDirectoryBlockHead {
        directoryBlockHead {
            keyMR
            previousBlock {
                height
            }
            nextBlock {
                height
            }
            height
            timestamp
            adminBlock {
                lookupHash
            }
            entryBlockPage(first: 5, offset: 0) {
                entryBlocks {
                    chainId
                }
            }
            entryCreditBlock {
                fullHash
            }
            factoidBlock {
                bodyMR
            }
        }
    }
`;

export const QUERY_ENTRY = gql`
    query GetEntry($hash: Hash!) {
        entry(hash: $hash) {
            hash
            chainId
            timestamp
            externalIds
            content
            entryBlock {
                sequenceNumber
                timestamp
            }
        }
    }
`;

export const QUERY_ENTRY_ACK = gql`
    query GetEntryAck($hash: Hash!, $chainId: Hash!) {
        entryAck(hash: $hash, chainId: $chainId) {
            commitHash
            entryHash
            commitStatus {
                timestamp
                status
            }
            entryStatus {
                status
                timestamp
            }
        }
    }
`;

export const QUERY_EBLOCK = gql`
    query GetEntryBlock($hash: Hash!) {
        entryBlock(hash: $hash) {
            keyMR
            chainId
            sequenceNumber
            timestamp
            previousBlock {
                sequenceNumber
            }
            entryPage {
                pageLength
                totalCount
                offset
                entries {
                    chainId
                    timestamp
                }
            }
            directoryBlock {
                height
            }
        }
    }
`;

export const QUERY_ECBLOCK = gql`
    query GetEntryCreditBlock($hash: Hash!) {
        entryCreditBlock(hash: $hash) {
            headerHash
            fullHash
            bodyHash
            bodySize
            objectCount
            previousBlock {
                objectCount
            }
            nextBlock {
                bodyHash
            }
            commitPage(first: 5, offset: 0) {
                pageLength
                totalCount
                offset
                commits {
                    timestamp
                    signature
                    credits
                    entry {
                        content
                    }
                    entryCreditBlock {
                        fullHash
                    }
                }
            }
            directoryBlock {
                height
            }
        }
    }
`;

export const QUERY_ECBLOCK_HEIGHT = gql`
    query GetEntryCreditBlockByHeight($height: Height!) {
        entryCreditBlockByHeight(height: $height) {
            headerHash
            fullHash
            bodyHash
            bodySize
            objectCount
            previousBlock {
                objectCount
            }
            nextBlock {
                bodyHash
            }
            commitPage(first: 5, offset: 0) {
                pageLength
                totalCount
                offset
                commits {
                    timestamp
                    signature
                    credits
                    entry {
                        content
                    }
                    entryCreditBlock {
                        fullHash
                    }
                }
            }
            directoryBlock {
                height
            }
        }
    }
`;

export const QUERY_ECBLOCK_HEAD = gql`
    query GetEntryCreditBlockHead {
        entryCreditBlockHead {
            headerHash
            fullHash
            bodyHash
            bodySize
            objectCount
            previousBlock {
                objectCount
            }
            nextBlock {
                bodyHash
            }
            commitPage(first: 5, offset: 0) {
                pageLength
                totalCount
                offset
                commits {
                    timestamp
                    signature
                    credits
                    entry {
                        content
                    }
                    entryCreditBlock {
                        fullHash
                    }
                }
            }
            directoryBlock {
                height
            }
        }
    }
`;

export const QUERY_ECRATE = gql`
    query GetEntryCreditRate {
        entryCreditRate
    }
`;

export const QUERY_FBLOCK = gql`
    query GetFactoidBlock($hash: Hash!) {
        factoidBlock(hash: $hash) {
            keyMR
            bodyMR
            ledgerKeyMR
            previousBlock {
                bodyMR
            }
            nextBlock {
                entryCreditRate
            }
            entryCreditRate
            transactionPage(first: 5, offset: 0) {
                totalCount
                pageLength
                offset
                transactions {
                    inputs {
                        amount
                        address
                    }
                    factoidOutputs {
                        amount
                        address
                    }
                    entryCreditOutputs {
                        amount
                        address
                    }
                    totalInputs
                    totalFactoidOutputs
                    totalEntryCreditOutputs
                    rcds
                    signatures
                    fees
                    timestamp
                    hash
                    factoidBlock {
                        bodyMR
                    }
                }
            }
            directoryBlock {
                height
            }
        }
    }
`;

export const QUERY_FBLOCK_HEIGHT = gql`
    query GetFactoidBlockByHeight($height: Height!) {
        factoidBlockByHeight(height: $height) {
            keyMR
            bodyMR
            ledgerKeyMR
            previousBlock {
                bodyMR
            }
            nextBlock {
                entryCreditRate
            }
            entryCreditRate
            transactionPage(first: 5, offset: 0) {
                totalCount
                pageLength
                offset
                transactions {
                    inputs {
                        amount
                        address
                    }
                    factoidOutputs {
                        amount
                        address
                    }
                    entryCreditOutputs {
                        amount
                        address
                    }
                    totalInputs
                    totalFactoidOutputs
                    totalEntryCreditOutputs
                    rcds
                    signatures
                    fees
                    timestamp
                    hash
                    factoidBlock {
                        bodyMR
                    }
                }
            }
            directoryBlock {
                height
            }
        }
    }
`;

export const QUERY_FBLOCK_HEAD = gql`
    query GetFactoidBlockHead {
        factoidBlockHead {
            keyMR
            bodyMR
        }
    }
`;

export const QUERY_TX_ACK = gql`
    query GetFactoidTransactionAck($hash: Hash!) {
        factoidTransactionAck(hash: $hash) {
            hash
            txTimestamp
            blockTimestamp
            status
        }
    }
`;

export const QUERY_HEIGHTS = gql`
    query GetHeight {
        heights {
            leaderHeight
            directoryBlockHeight
            entryBlockHeight
            entryHeight
        }
    }
`;
