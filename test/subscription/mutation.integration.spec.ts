import {
    composeChainCommit,
    composeChainReveal,
    composeEntryCommit,
} from 'factom';
import { server } from '../../src/server';
import { createTestClient } from 'apollo-server-testing';
import {
    createChain,
    MUTATION_COMMIT_C,
    MUTATION_REVEAL_C,
    createEntry,
    MUTATION_COMMIT_E,
} from './mutationHelpers';
import { randomBytes } from 'crypto';
import { cli } from './factom';

const { mutate } = createTestClient(server as any);

const EC_ADDRESS = 'Es4D1XXGBBJcWea54xDLMVYgobHzciXKfPSxoZNdsbdjxJftPM6Y';

describe('Integration Test Mutations', () => {
    it('Should commit a chain', async () => {
        const chain = createChain();
        const commit = composeChainCommit(chain, EC_ADDRESS).toString('hex');
        const res = await mutate({ mutation: MUTATION_COMMIT_C, variables: { commit } });
        expect(res.data!.commitChain.entryHash).toBe(chain.firstEntry.hashHex());
        expect(res.data!.commitChain.transactionHash).toHaveLength(64);
        expect(res.data!.commitChain.chainIdHash).toHaveLength(64);
    });

    it('Should attempt to commit a fake chain and return an error', async () => {
        const commit = randomBytes(200).toString('hex');
        const res = await mutate({ mutation: MUTATION_COMMIT_C, variables: { commit } });
        expect(res.errors).not.toBeNull();
    });

    it('Should commit an entry', async () => {
        const chain = await cli.addChain(createChain(), EC_ADDRESS);
        const entry = createEntry(chain.chainId);
        const commit = composeEntryCommit(entry, EC_ADDRESS).toString('hex');
        const res = await mutate({ mutation: MUTATION_COMMIT_E, variables: { commit } });
        expect(res.data!.commitEntry.entryHash).toBe(entry.hashHex());
        expect(res.data!.commitEntry.transactionHash).toHaveLength(64);
    });

    it('Should attempt to commit a fake entry and return an error', async () => {
        const commit = randomBytes(136).toString('hex');
        const res = await mutate({ mutation: MUTATION_COMMIT_E, variables: { commit } });
        expect(res.errors).not.toBeNull();
    });

    it('Should reveal a chain', async () => {
        const chain = createChain();
        await cli.commitChain(chain, EC_ADDRESS);
        const reveal = composeChainReveal(chain).toString('hex');
        const res = await mutate({ mutation: MUTATION_REVEAL_C, variables: { reveal } });
        expect(res.data!.revealChain.chainId).toBe(chain.idHex);
        expect(res.data!.revealChain.entryHash).toBe(chain.firstEntry.hashHex());
    });

    it('Should attempt to reveal a fake chain and return an error', async () => {
        const reveal = randomBytes(115).toString('hex');
        const res = await mutate({ mutation: MUTATION_REVEAL_C, variables: { reveal } });
        expect(res.errors).not.toBeNull();
    });
});
