const {
    entryCreditBlockQueries,
    entryCreditBlockResolvers
} = require('../EntryCreditBlock');
const { InMemoryLRUCache } = require('apollo-server-caching');
const { FactomdDataSource } = require('../../datasource');
const { cli } = require('../../factom');
const { randomBytes } = require('crypto');

const factomd = new FactomdDataSource(cli);
const cache = new InMemoryLRUCache();
factomd.initialize({
    cache,
    context: {}
});
const context = { dataSources: { factomd } };

describe('EntryCreditBlock resolvers', () => {
    afterEach(() => cache.flush());

    it('Should resolve the headerHash from the entryCreditBlock query', async () => {
        const hash = '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const entryCreditBlock = await entryCreditBlockQueries.entryCreditBlock(
            undefined,
            { hash },
            context
        );
        expect(entryCreditBlock).toEqual({ headerHash: hash });
    });

    it('Should return null for an entryCreditBlock that does not exist', async () => {
        const entryCreditBlock = await entryCreditBlockQueries.entryCreditBlock(
            undefined,
            { hash: randomBytes(32).toString('hex') },
            context
        );
        expect(entryCreditBlock).toBeNull();
    });

    it('Should resolve the headerHash from the entryCreditBlockByHeight query', async () => {
        const hash = '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const entryCreditBlock = await entryCreditBlockQueries.entryCreditBlockByHeight(
            undefined,
            { height: 10 },
            context
        );
        expect(entryCreditBlock).toEqual({ headerHash: hash });
    });

    it('Should return null for an entryCreditBlockByHeight that does not exist', async () => {
        const entryCreditBlock = await entryCreditBlockQueries.entryCreditBlockByHeight(
            undefined,
            { height: Number.MAX_SAFE_INTEGER },
            context
        );
        expect(entryCreditBlock).toBeNull();
    });

    it('Should resolve the fullHash field', async () => {
        const headerHash =
            '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const fullHash = await entryCreditBlockResolvers.fullHash(
            { headerHash },
            undefined,
            context
        );
        expect(fullHash).toBe(
            '298121b6bd1aa048b4b7fc3a48488a1f3de7681e94fd40608dc4b2b13f4595c0'
        );
    });

    it('Should resolve the bodyHash field', async () => {
        const headerHash =
            '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const bodyHash = await entryCreditBlockResolvers.bodyHash(
            { headerHash },
            undefined,
            context
        );
        expect(bodyHash).toBe(
            '898b0672bb93057a2dec036ee99ef1a2cae3fcea76733b0f3272e2f5c69bd0e8'
        );
    });

    it('Should resolve the bodySize field', async () => {
        const headerHash =
            '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const bodySize = await entryCreditBlockResolvers.bodySize(
            { headerHash },
            undefined,
            context
        );
        expect(bodySize).toBe(433);
    });

    it('Should resolve the objectCount field', async () => {
        const headerHash =
            '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const objectCount = await entryCreditBlockResolvers.objectCount(
            { headerHash },
            undefined,
            context
        );
        expect(objectCount).toBe(14);
    });

    it('Should resolve the previousBlock field', async () => {
        const headerHash =
            '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const previousBlock = await entryCreditBlockResolvers.previousBlock(
            { headerHash },
            undefined,
            context
        );
        expect(previousBlock).toEqual({
            headerHash: 'b88eb7b3fc0c1899e1e4603b04ce0820f2a14b754df75587164d6dfb577b0d19'
        });
    });

    it('Should return null for a previousBlock that does not exist', async () => {
        // Genesis block
        const headerHash =
            '66fb49a15b68a2a0ce2382e6aa6970c835497c6074bec9794ccf84bb331ad135';
        const previousBlock = await entryCreditBlockResolvers.previousBlock(
            { headerHash },
            undefined,
            context
        );
        expect(previousBlock).toBeNull();
    });

    it('Should resolve the nextBlock field', async () => {
        const headerHash =
            '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const nextBlock = await entryCreditBlockResolvers.nextBlock(
            { headerHash },
            undefined,
            context
        );
        expect(nextBlock).toEqual({
            headerHash: 'f294cd012b3c088740aa90b1fa8feead006c5a35176f57dd0bc7aac19c88f409'
        });
    });

    it('Should return null for a nextBlock that does not exist', async () => {
        const directoryBlockHead = await cli.getDirectoryBlockHead();
        const nextBlock = await entryCreditBlockResolvers.nextBlock(
            { headerHash: directoryBlockHead.entryCreditBlockRef },
            undefined,
            context
        );
        expect(nextBlock).toBeNull();
    });

    it('Should resolve all the commits in an entryCredit block', async () => {
        const headerHash =
            '7d6bfb96050ed1351b01f297ec53e0371e9ad0edd825528abbf06524b05dc0f2';
        const allCommits = await entryCreditBlockResolvers.commitPage(
            { headerHash },
            {},
            context
        );

        expect(allCommits.commits).toHaveLength(70);
        expect(allCommits.pageLength).toBe(70);
        expect(allCommits.totalCount).toBe(70);
        expect(allCommits.offset).toBe(0);
        allCommits.commits.forEach(commit => {
            expect(typeof commit.timestamp).toBe('number');
            expect(typeof commit.credits).toBe('number');
            expect(typeof commit.paymentAddress).toBe('string');
            expect(typeof commit.signature).toBe('string');
            expect(commit.entry).not.toBeUndefined();
            expect(typeof commit.entry.hash).toBe('string');
            expect(commit.entryCreditBlock).not.toBeUndefined();
            expect(commit.entryCreditBlock.headerHash).toBe(headerHash);
        });
    });

    it('Should resolve the last 20 paginated commits in an entryCredit block', async () => {
        const headerHash =
            '7d6bfb96050ed1351b01f297ec53e0371e9ad0edd825528abbf06524b05dc0f2';
        const first20 = await entryCreditBlockResolvers.commitPage(
            { headerHash },
            { offset: 0, first: 20 },
            context
        );
        expect(first20.commits).toHaveLength(20);
        expect(first20.pageLength).toBe(20);
        expect(first20.totalCount).toBe(70);
        expect(first20.offset).toBe(0);
        expect(first20.commits[0].entry.hash).toBe(
            'c3777ad5e9335d1edb967b1657e586da38614e3bc3678040895a33ce8060e09a'
        );
        expect(first20.commits[19].entry.hash).toBe(
            '7731f7abe4939c161eb2fc167112bb9b12d37f88e3b453ce58c3290f4feefc84'
        );
    });

    it('Should resolve the last 20 paginated commits in an entryCredit block with bad first input', async () => {
        const headerHash =
            '7d6bfb96050ed1351b01f297ec53e0371e9ad0edd825528abbf06524b05dc0f2';
        const last20 = await entryCreditBlockResolvers.commitPage(
            { headerHash },
            { offset: 50, first: 30 },
            context
        );
        expect(last20.commits).toHaveLength(20);
        expect(last20.pageLength).toBe(20);
        expect(last20.totalCount).toBe(70);
        expect(last20.offset).toBe(50);
        expect(last20.commits[0].entry.hash).toBe(
            '11ebac7db84c20f40dee4aaadddfd3eb8f94af493befc812f8a16474aa9581ec'
        );
        expect(last20.commits[19].entry.hash).toBe(
            '59a2410684621980a119271456d89c998301475028abc08913f3806575735aef'
        );
    });

    it('Should resolve the directoryBlock field', async () => {
        const headerHash =
            '7d6bfb96050ed1351b01f297ec53e0371e9ad0edd825528abbf06524b05dc0f2';
        const directoryBlock = await entryCreditBlockResolvers.directoryBlock(
            { headerHash },
            {},
            context
        );
        expect(directoryBlock).toEqual({
            keyMR: '857b10ef53a83d9b29d93ce1e8e72e65ea3ce3a39273565ac01727963ee49636'
        });
    });
});
