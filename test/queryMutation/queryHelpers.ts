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
