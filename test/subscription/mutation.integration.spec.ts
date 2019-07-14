import { composeChainCommit, composeChainReveal } from 'factom';
import { server } from '../../src/server';
import { createTestClient } from 'apollo-server-testing';
import { createChain, MUTATION_COMMIT_C } from './mutationHelpers';
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

    it('Should attempt to commit a fake chain and throw', async () => {
        const commit = randomBytes(200).toString('hex');
        const res = await mutate({ mutation: MUTATION_COMMIT_C, variables: { commit } });
        expect(res.errors).toBeDefined();
    });

    it('Should attempt to reveal a chain', async () => {
        const chain = createChain();
        await cli.commitChain(chain, EC_ADDRESS);
        const reveal = composeChainReveal(chain).toString('hex');
        const res = await mutate({ mutation: MUTATION_COMMIT_C, variables: { reveal } });
        console.log(res);
    });
});
