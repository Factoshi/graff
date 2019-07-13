import { FactomCli, Entry, Chain } from 'factom';
import config from './.factomds.json';
import gql from 'graphql-tag';
import { randomBytes } from 'crypto';

const cli = new FactomCli({ port: config.factomd.apiPort });

export const createChains = (num = 1) => {
    const c = Array(num)
        .fill(0)
        .map(() => {
            const entry = Entry.builder()
                .extId('test', 'utf8')
                .extId(randomBytes(4).toString('hex'), 'utf8')
                .content('hello', 'utf8')
                .build();
            return new Chain(entry);
        });
    return cli.add(c, 'EC3b6ph71PXiXorFnStNNPNP8mF4YkZMQwQxH4oNs52HvXiXgjar');
};

export const sendTransaction = async (destination: string) => {
    const tx = await cli.createFactoidTransaction(
        'FA2jK2HcLnRdS94dEcU27rF3meoJfpUcZPSinpb7AwQvPRY6RL1Q',
        destination,
        1000000
    );
    return cli.sendTransaction(tx);
};

export const SUBSCRIBE_DBLOCK = gql`
    subscription DirectoryBlock {
        newDirectoryBlock {
            keyMR
            height
            timestamp
            previousBlock {
                height
            }
            nextBlock {
                height
            }
            adminBlock {
                backReferenceHash
            }
            entryBlockPage(first: 1, offset: 0) {
                pageLength
                offset
                totalCount
                entryBlocks {
                    keyMR
                    chainId
                }
            }
            entryCreditBlock {
                headerHash
                commitPage(first: 1, offset: 0) {
                    pageLength
                    commits {
                        entry {
                            content
                            externalIds
                        }
                    }
                }
            }
            factoidBlock {
                keyMR
                previousBlock {
                    keyMR
                }
                transactionPage(first: 1, offset: 0) {
                    totalCount
                    pageLength
                    transactions {
                        hash
                    }
                }
            }
        }
    }
`;

export const SUBSCRIBE_ABLOCK = gql`
    subscription {
        newAdminBlock {
            backReferenceHash
            lookupHash
            bodySize
            directoryBlock {
                height
            }
            nextBlock {
                backReferenceHash
            }
            previousBlock {
                backReferenceHash
            }
            entries {
                ... on DirectoryBlockSignature {
                    identityChainId
                    code
                    id
                    previousDirectoryBlockSignature {
                        signature
                    }
                }
            }
        }
    }
`;

export const SUBSCRIBE_ECBLOCK = gql`
    subscription {
        newEntryCreditBlock {
            headerHash
            fullHash
            bodyHash
            bodySize
            objectCount
            previousBlock {
                headerHash
            }
            nextBlock {
                headerHash
            }
            commitPage(first: 5, offset: 0) {
                pageLength
                totalCount
                offset
                commits {
                    credits
                    timestamp
                    entry {
                        content
                    }
                    paymentAddress
                }
            }
            directoryBlock {
                height
            }
        }
    }
`;

export const SUBSCRIBE_FBLOCK = gql`
    subscription {
        newFactoidBlock {
            keyMR
            bodyMR
            ledgerKeyMR
            previousBlock {
                keyMR
            }
            nextBlock {
                keyMR
            }
            entryCreditRate
            transactionPage(offset: 0, first: 5) {
                pageLength
                totalCount
                offset
                transactions {
                    hash
                    inputs {
                        amount
                        address
                    }
                }
            }
            directoryBlock {
                keyMR
            }
        }
    }
`;

export const SUBSCRIBE_NEW_CHAINS = gql`
    subscription {
        newChains {
            keyMR
            chainId
            sequenceNumber
            timestamp
            previousBlock {
                keyMR
            }
            entryPage(first: 5, offset: 0) {
                pageLength
                offset
                totalCount
                entries {
                    content
                }
            }
            directoryBlock {
                keyMR
            }
        }
    }
`;

export const SUBSCRIBE_NEW_EBLOCK = gql`
    subscription($chainId: Hash!) {
        newEntryBlock(chainId: $chainId) {
            keyMR
            chainId
            sequenceNumber
            timestamp
            previousBlock {
                keyMR
                sequenceNumber
            }
            entryPage {
                entries {
                    chainId
                    content
                }
            }
            directoryBlock {
                keyMR
            }
        }
    }
`;

export const SUBSCRIBE_NEW_TX = gql`
    subscription($address: PublicFactoidAddress!) {
        newFactoidTransaction(address: $address) {
            hash
            timestamp
            inputs {
                address
                amount
            }
            factoidOutputs {
                address
                amount
            }
            entryCreditOutputs {
                address
                amount
            }
            totalInputs
            totalFactoidOutputs
            totalEntryCreditOutputs
            fees
            rcds
            signatures
            factoidBlock {
                keyMR
                ledgerKeyMR
            }
        }
    }
`;
