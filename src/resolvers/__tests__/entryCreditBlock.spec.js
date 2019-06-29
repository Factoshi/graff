const {
    entryCreditBlockRootQueries,
    entryCreditBlockResolvers
} = require('../EntryCreditBlock');
const { FactomdDataLoader } = require('../../data_loader');
const { cli } = require('../../factom');
const { assert } = require('chai');

describe('EntryCreditBlock resolvers', () => {
    let factomd;
    beforeEach(() => (factomd = new FactomdDataLoader(cli)));

    it('Should get the leaves of EntryCreditBlock from the entryCreditBlock resolver using a hash.', async () => {
        const hash = '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const height = 10;
        const entryCreditBlock = await entryCreditBlockRootQueries.entryCreditBlock(
            undefined,
            { arg: hash },
            { factomd }
        );
        assert.deepStrictEqual(entryCreditBlock, { hash, height });
    });

    it('Should get the leaves of EntryCreditBlock from the entryCreditBlock resolver using a height.', async () => {
        const hash = '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const height = 10;
        const entryCreditBlock = await entryCreditBlockRootQueries.entryCreditBlock(
            undefined,
            { arg: height },
            { factomd }
        );
        assert.deepStrictEqual(entryCreditBlock, { hash, height });
    });

    it('Should get the hash of EntryCreditBlock from the entryCreditBlockHead resolver', async () => {
        const entryCreditBlock = await entryCreditBlockRootQueries.entryCreditBlockHead(
            undefined,
            undefined,
            { factomd }
        );
        assert.hasAllKeys(entryCreditBlock, ['hash']);
        assert.isString(entryCreditBlock.hash);
    });

    it('Should resolve the height field', async () => {
        const hash = '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const entryCreditHeight = await entryCreditBlockResolvers.height(
            { hash },
            undefined,
            { factomd }
        );
        assert.strictEqual(entryCreditHeight, 10);
    });

    it('Should resolve the previousBlock field', async () => {
        const hash = '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const previousBlock = await entryCreditBlockResolvers.previousBlock(
            { hash },
            undefined,
            { factomd }
        );
        assert.deepStrictEqual(previousBlock, {
            hash: 'b88eb7b3fc0c1899e1e4603b04ce0820f2a14b754df75587164d6dfb577b0d19'
        });
    });

    it('Should resolve the nextBlock field', async () => {
        const hash = '96131286eb49d4eb587a7dbce7a6af968b52fa0b0a9f31be9c4ff6ce5096ce68';
        const nextBlock = await entryCreditBlockResolvers.nextBlock({ hash }, undefined, {
            factomd
        });
        assert.deepStrictEqual(nextBlock, {
            hash: 'f294cd012b3c088740aa90b1fa8feead006c5a35176f57dd0bc7aac19c88f409'
        });
    });

    it('should get all the commits in an entryCredit block', async () => {
        const hash = '7d6bfb96050ed1351b01f297ec53e0371e9ad0edd825528abbf06524b05dc0f2';
        const allCommits = await entryCreditBlockResolvers.commits(
            { hash },
            {},
            { factomd }
        );
        assert.hasAllKeys(allCommits, [
            'commits',
            'totalCount',
            'offset',
            'pageLength',
            'finalPage'
        ]);
        assert.strictEqual(allCommits.totalCount, 70);
        assert.lengthOf(allCommits.commits, 70);
        assert.strictEqual(allCommits.offset, 0);
        assert.strictEqual(allCommits.pageLength, 70);
        assert.isTrue(allCommits.finalPage);
        allCommits.commits.forEach(commit => {
            assert.hasAllKeys(commit, [
                'timestamp',
                'entry',
                'credits',
                'paymentAddress',
                'block'
            ]);
            assert.hasAllKeys(commit.block, ['hash']);
            assert.hasAllKeys(commit.entry, ['hash']);
            assert.isNumber(commit.credits);
            assert.isString(commit.paymentAddress);
            assert.isNumber(commit.timestamp);
        });
    });

    it('should get the last 20 paginated commits in an entryCredit block', async () => {
        const hash = '7d6bfb96050ed1351b01f297ec53e0371e9ad0edd825528abbf06524b05dc0f2';
        const first20 = await entryCreditBlockResolvers.commits(
            { hash },
            { offset: 0, first: 20 },
            { factomd }
        );
        assert.strictEqual(first20.totalCount, 70);
        assert.lengthOf(first20.commits, 20);
        assert.strictEqual(first20.offset, 0);
        assert.strictEqual(first20.pageLength, 20);
        assert.isFalse(first20.finalPage);
        assert.strictEqual(
            first20.commits[0].entry.hash,
            'c3777ad5e9335d1edb967b1657e586da38614e3bc3678040895a33ce8060e09a'
        );
        assert.strictEqual(
            first20.commits[19].entry.hash,
            '7731f7abe4939c161eb2fc167112bb9b12d37f88e3b453ce58c3290f4feefc84'
        );
    });

    it('should get the last 20 paginated commits in an entryCredit block with bad first input', async () => {
        const hash = '7d6bfb96050ed1351b01f297ec53e0371e9ad0edd825528abbf06524b05dc0f2';
        const entryCommits = await entryCreditBlockResolvers.commits(
            { hash },
            { offset: 50, first: 30 },
            { factomd }
        );
        assert.strictEqual(entryCommits.totalCount, 70);
        assert.lengthOf(entryCommits.commits, 20);
        assert.strictEqual(entryCommits.offset, 50);
        assert.strictEqual(entryCommits.pageLength, 20);
        assert.isTrue(entryCommits.finalPage);
        assert.strictEqual(
            entryCommits.commits[0].entry.hash,
            '11ebac7db84c20f40dee4aaadddfd3eb8f94af493befc812f8a16474aa9581ec'
        );
        assert.strictEqual(
            entryCommits.commits[19].entry.hash,
            '59a2410684621980a119271456d89c998301475028abc08913f3806575735aef'
        );
    });

    it('should get the hash of the parent directory block', async () => {
        const hash = '7d6bfb96050ed1351b01f297ec53e0371e9ad0edd825528abbf06524b05dc0f2';
        const directoryBlock = await entryCreditBlockResolvers.directoryBlock(
            { hash },
            {},
            { factomd }
        );
        assert.deepStrictEqual(directoryBlock, {
            hash: '857b10ef53a83d9b29d93ce1e8e72e65ea3ce3a39273565ac01727963ee49636'
        });
    });
});
