import {
    composeChainCommit,
    composeChainReveal,
    composeEntryCommit,
    composeEntryReveal
} from 'factom';
import {
    createChain,
    MUTATION_COMMIT_C,
    MUTATION_REVEAL_C,
    createEntry,
    MUTATION_COMMIT_E,
    MUTATION_REVEAL_E,
    MUTATION_ADD_C,
    MUTATION_ADD_E,
    createTx,
    MUTATION_SUBMIT_TX
} from './mutationHelpers';
import { randomBytes } from 'crypto';
import { cli } from '../factom';
import { apollo } from '../apolloClient';
import { server } from '../../src/server';
import { RedisCache } from 'apollo-server-cache-redis';
import { cache } from '../../src/connect';

const EC_ADDRESS = 'Es4D1XXGBBJcWea54xDLMVYgobHzciXKfPSxoZNdsbdjxJftPM6Y';

describe('Integration Test Mutations', () => {
    beforeAll(() => server.listen());
    afterAll(async () => {
        if (cache instanceof RedisCache) {
            cache.close();
        }
        return server.stop();
    });

    it('Should commit a chain', async () => {
        const chain = createChain();
        const commit = composeChainCommit(chain, EC_ADDRESS).toString('hex');
        const res = await apollo.mutate({
            mutation: MUTATION_COMMIT_C,
            variables: { commit }
        });
        expect(res.data!.commitChain.entryHash).toBe(chain.firstEntry.hashHex());
        expect(res.data!.commitChain.transactionHash).toHaveLength(64);
        expect(res.data!.commitChain.chainIdHash).toHaveLength(64);
    });

    it('Should attempt to commit a fake chain and throw', async () => {
        const commit = randomBytes(200).toString('hex');
        const pendingMutation = apollo.mutate({
            mutation: MUTATION_COMMIT_C,
            variables: { commit }
        });
        await expect(pendingMutation).rejects.toThrow();
    });

    it('Should commit an entry', async () => {
        const chain = await cli.addChain(createChain(), EC_ADDRESS);
        const entry = createEntry(chain.chainId);
        const commit = composeEntryCommit(entry, EC_ADDRESS).toString('hex');
        const res = await apollo.mutate({
            mutation: MUTATION_COMMIT_E,
            variables: { commit }
        });
        expect(res.data!.commitEntry.entryHash).toBe(entry.hashHex());
        expect(res.data!.commitEntry.transactionHash).toHaveLength(64);
    });

    it('Should attempt to commit a fake entry and throw', async () => {
        const commit = randomBytes(136).toString('hex');
        const pendingMutation = apollo.mutate({
            mutation: MUTATION_COMMIT_E,
            variables: { commit }
        });
        await expect(pendingMutation).rejects.toThrow();
    });

    it('Should reveal a chain', async () => {
        const chain = createChain();
        await cli.commitChain(chain, EC_ADDRESS);
        const reveal = composeChainReveal(chain).toString('hex');
        const res = await apollo.mutate({
            mutation: MUTATION_REVEAL_C,
            variables: { reveal }
        });
        expect(res.data!.revealChain.chainId).toBe(chain.idHex);
        expect(res.data!.revealChain.entryHash).toBe(chain.firstEntry.hashHex());
    });

    it('Should attempt to reveal a fake chain and throw', async () => {
        const reveal = randomBytes(115).toString('hex');
        const pendingMutation = apollo.mutate({
            mutation: MUTATION_REVEAL_C,
            variables: { reveal }
        });
        expect(pendingMutation).rejects.toThrow();
    });

    it('Should reveal an entry', async () => {
        const chain = await cli.addChain(createChain(), EC_ADDRESS);
        const entry = createEntry(chain.chainId);
        await cli.commitEntry(entry, EC_ADDRESS);
        const reveal = composeEntryReveal(entry).toString('hex');
        const res = await apollo.mutate({
            mutation: MUTATION_REVEAL_E,
            variables: { reveal }
        });
        expect(res.data!.revealEntry.chainId).toBe(chain.chainId);
        expect(res.data!.revealEntry.entryHash).toBe(entry.hashHex());
    });

    it('Should attempt to reveal a fake entry and return an error', async () => {
        const reveal = randomBytes(115).toString('hex');
        const pendingMutation = apollo.mutate({
            mutation: MUTATION_REVEAL_E,
            variables: { reveal }
        });
        expect(pendingMutation).rejects.toThrow();
    });

    it('Should add a chain', async () => {
        const chain = createChain();
        const commit = composeChainCommit(chain, EC_ADDRESS).toString('hex');
        const reveal = composeChainReveal(chain).toString('hex');
        const res = await apollo.mutate({
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
        const res = await apollo.mutate({
            mutation: MUTATION_ADD_E,
            variables: { commit, reveal }
        });
        expect(res.data!.addEntry.chainId).toBe(chain.chainId);
        expect(res.data!.addEntry.entryHash).toBe(entry.hashHex());
    });

    it('Should submit a factoid transaction', async () => {
        const tx = createTx()
            .marshalBinary()
            .toString('hex');
        const res = await apollo.mutate({
            mutation: MUTATION_SUBMIT_TX,
            variables: { tx }
        });
        expect(res.data!.submitTransaction).toHaveLength(64);
    });

    it('Should attempt to submit a fake transaction and throw', async () => {
        const tx = randomBytes(177).toString('hex');
        const pendingMutation = apollo.mutate({
            mutation: MUTATION_SUBMIT_TX,
            variables: { tx }
        });
        expect(pendingMutation).rejects.toThrow();
    });
});
