import {
    QUERY_DBLOCK,
    QUERY_DBLOCK_HEIGHT,
    QUERY_DBLOCK_HEAD,
    QUERY_ABLOCK,
    QUERY_ABLOCK_HEIGHT,
    QUERY_ABLOCK_HEAD,
    QUERY_BALANCES,
    QUERY_CHAIN_HEAD,
    QUERY_COMMIT_ACK,
    QUERY_ENTRY_ACK,
    QUERY_CURRENT_MINUTE,
    QUERY_ENTRY,
    QUERY_EBLOCK,
    QUERY_ECBLOCK,
    QUERY_ECBLOCK_HEIGHT,
    QUERY_ECBLOCK_HEAD,
    QUERY_ECRATE,
    QUERY_FBLOCK,
    QUERY_FBLOCK_HEIGHT,
    QUERY_FBLOCK_HEAD,
    QUERY_TX_ACK,
    QUERY_HEIGHTS,
    QUERY_PENDING_ENTRIES,
    QUERY_PENDING_TXS
} from './queryHelpers';
import { server } from '../../src/server';
import { createTestClient } from 'apollo-server-testing';
import { cli } from './factom';
import { randomBytes } from 'crypto';

const { query } = createTestClient(server as any);

describe('Integration Test Queries', () => {
    it('Should query an admin block by hash.', async () => {
        const res = await query({
            query: QUERY_ABLOCK,
            variables: {
                // coinbase descriptor is in the query, but not the admin block. It should be excluded.
                hash: 'f8e211a95158df9bf01b1bd74517c6985891dbcba397d24995f95e0ce5fca778'
            }
        });
        expect(res.data).toMatchSnapshot();
    });

    it('Should query an admin block by height.', async () => {
        const res = await query({
            query: QUERY_ABLOCK_HEIGHT,
            variables: { height: 201100 }
        });
        expect(res.data).toMatchSnapshot();
    });

    it('Should query the admin block head.', async () => {
        const [expected, res] = await Promise.all([
            cli.getDirectoryBlockHead().then(res => cli.getAdminBlock(res.adminBlockRef)),
            query({ query: QUERY_ABLOCK_HEAD }) as any
        ]);
        const aBlock = res.data.adminBlockHead;
        expect(expected.backReferenceHash).toBe(aBlock.backReferenceHash);
        expect(aBlock.nextBlock).toBeNull();
    });

    it('Should query the balances of several addresses', async () => {
        const fctAddress = 'FA3RqGvKruW9BPTPHqRGAop76HgJm4fHoit7wW4aqmPyHtrjCy1M';
        const ecAddress = 'EC2XugtJ3PqJdAqVGeKnUZLKs2XhZM3kkXJor7DiYkN9uSKqKWB9';
        const [fctBalance, ecBalance, queryResult] = await Promise.all([
            cli.getBalance(fctAddress),
            cli.getBalance(ecAddress),
            query({
                query: QUERY_BALANCES,
                variables: { addresses: [fctAddress, ecAddress] }
            })
        ]);
        expect(queryResult.data!.balances[0]).toEqual({
            address: fctAddress,
            amount: fctBalance
        });
        expect(queryResult.data!.balances[1]).toEqual({
            address: ecAddress,
            amount: ecBalance
        });
    });

    // TODO: Create test for invalid addresses. Set up Address scalar.

    it('Should query the chain head of a chainId', async () => {
        const chainId =
            'df3ade9eec4b08d5379cc64270c30ea7315d8a8a1a69efe2b98a60ecdd69e604';
        const [actual, queryResult] = await Promise.all([
            cli.getChainHead(chainId),
            query({ query: QUERY_CHAIN_HEAD, variables: { chainId } })
        ]);
        expect(queryResult.data!.chainHead.keyMR).toBe(actual.keyMR);
    });

    it('Should query the ack of a legit commit', async () => {
        const hash = '905ec512fe25a64e2e29ebad1614250416b625c15df4f795dd95ed92c7074066';
        const queryResponse = await query({
            query: QUERY_COMMIT_ACK,
            variables: { hash }
        });
        expect(queryResponse.data).toMatchSnapshot();
    });

    it('Should query the ack of a fake commit', async () => {
        const fake = 'fc6b74ec5e22366f80b6e1e1b01f651929fef228ad745fa8b41676e29b9c8bf8';
        const queryResponse = await query({
            query: QUERY_COMMIT_ACK,
            variables: { hash: fake }
        });
        expect(queryResponse.data!.commitAck.commitStatus.status).toBe('Unknown');
    });

    it('Should query the current minute', async () => {
        const queryResponse = await query({ query: QUERY_CURRENT_MINUTE });
        expect(queryResponse).toBeDefined();
    });

    it('Should query a directory block by hash.', async () => {
        const res = await query({
            query: QUERY_DBLOCK,
            variables: {
                hash: 'e9b52c4b48325c83de601c022cb314d819c911ae24bda0ca4a17476562622bd0'
            }
        });
        expect(res.data).toMatchSnapshot();
    });

    it('Should query a directory block by height.', async () => {
        const res = await query({
            query: QUERY_DBLOCK_HEIGHT,
            variables: { height: 200361 }
        });
        expect(res.data).toMatchSnapshot();
    });

    it('Should query a directory block head.', async () => {
        const [expected, res] = await Promise.all([
            cli.getDirectoryBlockHead(),
            query({ query: QUERY_DBLOCK_HEAD }) as any
        ]);
        const dBlock = res.data.directoryBlockHead;
        expect(dBlock.keyMR).toBe(expected.keyMR);
        expect(dBlock.nextBlock).toBeNull();
    });

    it('Should query an entry', async () => {
        const hash = '086c77c9e6a98191bcd828f099787402fa6fb7c880797c6489a49cb3cb31cdaf';
        const queryResponse = await query({ query: QUERY_ENTRY, variables: { hash } });
        expect(queryResponse.data).toMatchSnapshot();
    });

    it('Should return null for an unkown entry', async () => {
        const hash = randomBytes(32).toString('hex');
        const queryResponse = await query({ query: QUERY_ENTRY, variables: { hash } });
        expect(queryResponse.data!.entry).toBeNull();
    });

    it('Should get the ack of a known entry', async () => {
        const hash = '5d8870cdcef3ab5fc05b6d94ff8c0f0f8a8ec4b2eb5643fe3a72e0f8c5c0a708';
        const chainId =
            '5ff8793f2aadba003adcc52cf6de55c2780b16cce5bb264d417f48c5f8c2913b';
        const queryResponse = await query({
            query: QUERY_ENTRY_ACK,
            variables: { hash, chainId }
        });
        expect(queryResponse.data).toMatchSnapshot();
    });

    it('Should return null for the ack of a fake entry', async () => {
        const hash = randomBytes(32).toString('hex');
        const chainId = randomBytes(32).toString('hex');
        const queryResponse = await query({
            query: QUERY_ENTRY_ACK,
            variables: { hash, chainId }
        });
        expect(queryResponse.data).toBeNull();
    });

    it('Should query an entry block', async () => {
        const hash = '8ee8eb697d71f3485e3b7389cea5e19a86029b109333b7ea201084212ba3c75b';
        const queryResponse = await query({ query: QUERY_EBLOCK, variables: { hash } });
        expect(queryResponse.data).toMatchSnapshot();
    });

    it('Should return null for an unkown entry block', async () => {
        const hash = randomBytes(32).toString('hex');
        const queryResponse = await query({ query: QUERY_EBLOCK, variables: { hash } });
        expect(queryResponse.data!.entryBlock).toBeNull();
    });

    it('Should query an entry credit block', async () => {
        const hash = '22d7ed3e6007bf59c0faa8d018f7998f08cfbc8310228155ba5ff7dacbca4ed0';
        const queryResponse = await query({ query: QUERY_ECBLOCK, variables: { hash } });
        expect(queryResponse.data).toMatchSnapshot();
    });

    it('Should return null for an unkown entry credit block', async () => {
        const hash = randomBytes(32).toString('hex');
        const queryResponse = await query({ query: QUERY_ECBLOCK, variables: { hash } });
        expect(queryResponse.data!.entryCreditBlock).toBeNull();
    });

    it('Should query an entry credit block by height', async () => {
        const queryResponse = await query({
            query: QUERY_ECBLOCK_HEIGHT,
            variables: { height: 10 }
        });
        expect(queryResponse).toMatchSnapshot();
    });

    it('Should return null when querying an entry credit block height that does not exist.', async () => {
        const queryResponse = await query({
            query: QUERY_ECBLOCK_HEIGHT,
            variables: { height: Number.MAX_SAFE_INTEGER }
        });
        expect(queryResponse.data!.entryCreditBlockByHeight).toBeNull();
    });

    it('Should query an entry credit block head', async () => {
        const dblockHead = await cli.getDirectoryBlockHead();
        const ecBlockHead = await cli.getEntryCreditBlock(dblockHead.entryCreditBlockRef);
        const queryResponse = await query({ query: QUERY_ECBLOCK_HEAD });
        expect(queryResponse.data!.entryCreditBlockHead.headerHash).toBe(
            ecBlockHead.headerHash
        );
    });

    it('Should query the entry credit rate', async () => {
        const [expectedRate, actualRate] = await Promise.all([
            cli.factomdApi('entry-credit-rate'),
            query({ query: QUERY_ECRATE })
        ]);
        expect(actualRate.data!.entryCreditRate).toBe(expectedRate.rate);
    });

    it('Should query a factoid block by hash', async () => {
        const hash = '8519c32c9ed474f54ee95a63b679373015bc23db29f164a69eba0048783f2ccf';
        const fblock = await query({ query: QUERY_FBLOCK, variables: { hash } });
        expect(fblock).toMatchSnapshot();
    });

    it('Should return null when querying missing factoid block by hash', async () => {
        const hash = randomBytes(32).toString('hex');
        const fblock = await query({ query: QUERY_FBLOCK, variables: { hash } });
        expect(fblock.data!.factoidBlock).toBeNull();
    });

    it('Should query a factoid block by height', async () => {
        const fblock = await query({
            query: QUERY_FBLOCK_HEIGHT,
            variables: { height: 10 }
        });
        expect(fblock).toMatchSnapshot();
    });

    it('Should return null when querying missing factoid block by height', async () => {
        const fblock = await query({
            query: QUERY_FBLOCK_HEIGHT,
            variables: { height: Number.MAX_SAFE_INTEGER }
        });
        expect(fblock.data!.factoidBlockByHeight).toBeNull();
    });

    it('Should query the factoid block head', async () => {
        const dblockHead = await cli.getDirectoryBlockHead();
        const fBlockHead = await cli.getFactoidBlock(dblockHead.factoidBlockRef);
        const fBlock = await query({ query: QUERY_FBLOCK_HEAD });
        expect(fBlock.data!.factoidBlockHead.bodyMR).toBe(fBlockHead.bodyMR);
    });

    it('Should query a factoid transaction ack', async () => {
        const hash = '92e9d62ceef0d8fb3d22e1fc0b4faff68d7849bddb2fd8fa8c91ff463f55fb33';
        const ack = await query({ query: QUERY_TX_ACK, variables: { hash } });
        expect(ack).toMatchSnapshot();
    });

    it('Should query a missing factoid transaction ack', async () => {
        // last char is different to above hash
        const fake = '92e9d62ceef0d8fb3d22e1fc0b4faff68d7849bddb2fd8fa8c91ff463f55fb32';
        const ack = await query({ query: QUERY_TX_ACK, variables: { hash: fake } });
        expect(ack).toMatchSnapshot();
    });

    it('Should query heights', async () => {
        const heights = await query({ query: QUERY_HEIGHTS });
        Object.entries(heights.data!.heights).forEach(height =>
            expect(height[1]).toBeGreaterThan(0)
        );
    });

    it('Should query pending entries', async () => {
        const pendingEntries = await query({ query: QUERY_PENDING_ENTRIES });
        expect(pendingEntries.data!.pendingEntries).toBeDefined();
    });

    it('Should query pending transactions', async () => {
        const pendingTxs = await query({ query: QUERY_PENDING_TXS });
        expect(pendingTxs.data!.pendingTransactions).toBeDefined();
    });
});
