import { randomBytes } from 'crypto';
import { Entry, Chain, Transaction, generateRandomFctAddress } from 'factom';
import gql from 'graphql-tag';

export const createEntry = (chainId: string) =>
    Entry.builder()
        .timestamp(Date.now())
        .extId(Date.now().toString() + Math.random(), 'utf8')
        .extId('factom-graph', 'utf8')
        .content(randomBytes(32))
        .chainId(chainId)
        .build();

export const createChain = () => {
    const e = Entry.builder()
        .timestamp(Date.now())
        .extId(Date.now().toString() + Math.random(), 'utf8')
        .extId('factom-graph', 'utf8')
        .content(randomBytes(32))
        .build();
    return new Chain(e);
};

export const createTx = () =>
    Transaction.builder()
        .input('Fs3E9gV6DXsYzf7Fqx1fVBQPQXV695eP3k5XbmHEZVRLkMdD9qCK', 200000)
        .output(generateRandomFctAddress().public, 100000)
        .build();

export const MUTATION_COMMIT_C = gql`
    mutation CommitChain($commit: String!) {
        commitChain(commit: $commit) {
            entryHash
            transactionHash
            chainIdHash
        }
    }
`;

export const MUTATION_COMMIT_E = gql`
    mutation CommitEntry($commit: String!) {
        commitEntry(commit: $commit) {
            entryHash
            transactionHash
        }
    }
`;

export const MUTATION_REVEAL_C = gql`
    mutation RevealChain($reveal: String!) {
        revealChain(reveal: $reveal) {
            entryHash
            chainId
        }
    }
`;

export const MUTATION_REVEAL_E = gql`
    mutation RevealEntry($reveal: String!) {
        revealEntry(reveal: $reveal) {
            entryHash
            chainId
        }
    }
`;

export const MUTATION_ADD_C = gql`
    mutation AddChain($reveal: String!, $commit: String!) {
        addChain(reveal: $reveal, commit: $commit) {
            entryHash
            chainId
        }
    }
`;

export const MUTATION_ADD_E = gql`
    mutation AddEntry($reveal: String!, $commit: String!) {
        addEntry(reveal: $reveal, commit: $commit) {
            entryHash
            chainId
        }
    }
`;

export const MUTATION_SUBMIT_TX = gql`
    mutation SubmitTransactions($tx: String!) {
        submitTransaction(tx: $tx)
    }
`;
