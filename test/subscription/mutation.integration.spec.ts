import {
    composeChainCommit,
    composeChainReveal,
    composeEntryCommit,
    composeEntryReveal
} from 'factom';
import { server } from '../../src/server';
import { createTestClient } from 'apollo-server-testing';
import {
    createChain,
    MUTATION_COMMIT_C,
    MUTATION_REVEAL_C,
    createEntry,
    MUTATION_COMMIT_E,
    MUTATION_REVEAL_E,
    MUTATION_ADD_C,
    MUTATION_ADD_E
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

    it('Should reveal an entry', async () => {
        const chain = await cli.addChain(createChain(), EC_ADDRESS);
        const entry = createEntry(chain.chainId);
        await cli.commitEntry(entry, EC_ADDRESS);
        const reveal = composeEntryReveal(entry).toString('hex');
        const res = await mutate({ mutation: MUTATION_REVEAL_E, variables: { reveal } });
        expect(res.data!.revealEntry.chainId).toBe(chain.chainId);
        expect(res.data!.revealEntry.entryHash).toBe(entry.hashHex());
    });

    it('Should attempt to reveal a fake entry and return an error', async () => {
        const reveal = randomBytes(115).toString('hex');
        const res = await mutate({ mutation: MUTATION_REVEAL_E, variables: { reveal } });
        expect(res.errors).not.toBeNull();
    });

    it('Should add a chain', async () => {
        const chain = createChain();
        const commit = composeChainCommit(chain, EC_ADDRESS).toString('hex');
        const reveal = composeChainReveal(chain).toString('hex');
        const res = await mutate({
            mutation: MUTATION_ADD_C,
            variables: { commit, reveal }
        });
        expect(res.data!.addChain.chainId).toBe(chain.idHex);
        expect(res.data!.addChain.entryHash).toBe(chain.firstEntry.hashHex());
    });

    it('Should add an entry', async () => {
        const chain = await cli.addChain(createChain(), EC_ADDRESS);
        const entry = createEntry(chain.chainId);
        const commit = composeEntryCommit(entry, EC_ADDRESS).toString('hex');
        const reveal = composeEntryReveal(entry).toString('hex');
        const res = await mutate({
            mutation: MUTATION_ADD_E,
            variables: { commit, reveal }
        });
        expect(res.data!.addEntry.chainId).toBe(chain.chainId);
        expect(res.data!.addEntry.entryHash).toBe(entry.hashHex());
    });
});
