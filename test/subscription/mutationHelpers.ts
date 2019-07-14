import { randomBytes } from 'crypto';
import { Entry, Chain } from 'factom';
import gql from 'graphql-tag';

export const createEntry = () =>
    Entry.builder()
        .timestamp(Date.now())
        .extId(Date.now().toString() + Math.random(), 'utf8')
        .extId('factom-graph', 'utf8')
        .content(randomBytes(32))
        .build();

export const createChain = () => new Chain(createEntry());

export const MUTATION_COMMIT_C = gql`
    mutation CommitChain($commit: String!) {
        commitChain(commit: $commit) {
            entryHash
            transactionHash
            chainIdHash
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
