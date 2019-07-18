import {
    createChains,
    SUBSCRIBE_DBLOCK,
    SUBSCRIBE_ABLOCK,
    SUBSCRIBE_ECBLOCK,
    sendTransaction,
    SUBSCRIBE_FBLOCK,
    SUBSCRIBE_NEW_CHAINS,
    SUBSCRIBE_NEW_EBLOCK,
    SUBSCRIBE_NEW_TX
} from './subscriptionHelpers';
import { assert } from 'chai';
import { AddResponse, generateRandomFctAddress } from 'factom';
import { apollo } from '../apolloClient';
import { server } from '../../src/server';
import { RedisCache } from 'apollo-server-cache-redis';
import { cache } from '../../src/connect';

describe('Integration Test Subscriptions', () => {
    let observable: any;
    afterEach(() => observable.unsubscribe());
    beforeAll(() => server.listen());
    afterAll(async () => {
        if (cache instanceof RedisCache) {
            cache.close();
        }
        return server.stop();
    });

    it('Should be notified of a new directory block', async () => {
        await createChains();
        const directoryBlock = (await new Promise((resolve, reject) => {
            observable = apollo.subscribe({ query: SUBSCRIBE_DBLOCK }).subscribe({
                error: reject,
                next: (res: any) => resolve(res.data.newDirectoryBlock)
            });
        })) as any;
        assert.hasAllDeepKeys(directoryBlock, [
            'keyMR',
            'height',
            'timestamp',
            'previousBlock',
            'nextBlock',
            'adminBlock',
            'entryBlockPage',
            'entryCreditBlock',
            'factoidBlock',
            '__typename'
        ]);
        assert.hasAllDeepKeys(directoryBlock.adminBlock, [
            'backReferenceHash',
            '__typename'
        ]);
        assert.hasAllDeepKeys(directoryBlock.entryBlockPage, [
            'pageLength',
            'offset',
            'totalCount',
            'entryBlocks',
            '__typename'
        ]);
        assert.hasAllDeepKeys(directoryBlock.entryBlockPage.entryBlocks[0], [
            'keyMR',
            'chainId',
            '__typename'
        ]);
        assert.hasAllDeepKeys(directoryBlock.entryCreditBlock, [
            'headerHash',
            'commitPage',
            '__typename'
        ]);
        assert.hasAllDeepKeys(directoryBlock.entryCreditBlock.commitPage, [
            'pageLength',
            'commits',
            '__typename'
        ]);
        assert.hasAllDeepKeys(directoryBlock.factoidBlock, [
            'keyMR',
            'previousBlock',
            'transactionPage',
            '__typename'
        ]);
        assert.hasAllDeepKeys(directoryBlock.factoidBlock.transactionPage, [
            'totalCount',
            'pageLength',
            'transactions',
            '__typename'
        ]);
        assert.hasAllDeepKeys(directoryBlock.factoidBlock.previousBlock, [
            'keyMR',
            '__typename'
        ]);
    }, 20000);

    it('Should be notified of a new admin block', async () => {
        const adminBlock = (await new Promise((resolve, reject) => {
            observable = apollo.subscribe({ query: SUBSCRIBE_ABLOCK }).subscribe({
                error: reject,
                next: (res: any) => resolve(res.data.newAdminBlock)
            });
        })) as any;
        assert.hasAllDeepKeys(adminBlock, [
            'backReferenceHash',
            'lookupHash',
            'bodySize',
            'directoryBlock',
            'nextBlock',
            'previousBlock',
            'entries',
            '__typename'
        ]);
        assert.hasAllDeepKeys(adminBlock.previousBlock, [
            'backReferenceHash',
            '__typename'
        ]);
        assert.hasAllDeepKeys(adminBlock.directoryBlock, ['height', '__typename']);
        assert.hasAllDeepKeys(adminBlock.entries[0], [
            'identityChainId',
            'code',
            'previousDirectoryBlockSignature',
            'id',
            '__typename'
        ]);
        assert.hasAllDeepKeys(adminBlock.entries[0].previousDirectoryBlockSignature, [
            'signature',
            '__typename'
        ]);
    }, 20000);

    it('Should be notified of a new entry credit block', async () => {
        await createChains();
        const entryCreditBlock = (await new Promise((resolve, reject) => {
            observable = apollo.subscribe({ query: SUBSCRIBE_ECBLOCK }).subscribe({
                error: reject,
                next: (res: any) => resolve(res.data.newEntryCreditBlock)
            });
        })) as any;
        assert.hasAllDeepKeys(entryCreditBlock, [
            'headerHash',
            'fullHash',
            'bodyHash',
            'bodySize',
            'objectCount',
            'previousBlock',
            'nextBlock',
            'commitPage',
            'directoryBlock',
            '__typename'
        ]);
        assert.hasAllDeepKeys(entryCreditBlock.previousBlock, [
            'headerHash',
            '__typename'
        ]);
        assert.hasAllDeepKeys(entryCreditBlock.commitPage, [
            'pageLength',
            'totalCount',
            'offset',
            'commits',
            '__typename'
        ]);
        assert.hasAllDeepKeys(entryCreditBlock.commitPage.commits[0], [
            'credits',
            'timestamp',
            'entry',
            'paymentAddress',
            '__typename'
        ]);
        assert.hasAllDeepKeys(entryCreditBlock.commitPage.commits[0].entry, [
            'content',
            '__typename'
        ]);
    }, 20000);

    it('Should be notified of a new factoid block', async () => {
        await sendTransaction(generateRandomFctAddress().public);
        const factoidBlock = (await new Promise((resolve, reject) => {
            observable = apollo.subscribe({ query: SUBSCRIBE_FBLOCK }).subscribe({
                error: reject,
                next: (res: any) => resolve(res.data.newFactoidBlock)
            });
        })) as any;
        assert.hasAllDeepKeys(factoidBlock, [
            'keyMR',
            'bodyMR',
            'ledgerKeyMR',
            'previousBlock',
            'nextBlock',
            'entryCreditRate',
            'transactionPage',
            'directoryBlock',
            '__typename'
        ]);
        assert.hasAllDeepKeys(factoidBlock.previousBlock, ['keyMR', '__typename']);
        assert.hasAllDeepKeys(factoidBlock.transactionPage, [
            'pageLength',
            'totalCount',
            'offset',
            'transactions',
            '__typename'
        ]);
        assert.hasAllDeepKeys(factoidBlock.transactionPage.transactions[0], [
            'hash',
            'inputs',
            '__typename'
        ]);
        assert.hasAllDeepKeys(factoidBlock.directoryBlock, ['keyMR', '__typename']);
    }, 20000);

    it('Should be notified of a new chain', async () => {
        await createChains();
        const chains = (await new Promise((resolve, reject) => {
            observable = apollo.subscribe({ query: SUBSCRIBE_NEW_CHAINS }).subscribe({
                error: reject,
                next: (res: any) => resolve(res.data.newChains)
            });
        })) as any;
        assert.hasAllDeepKeys(chains[0], [
            'keyMR',
            'chainId',
            'sequenceNumber',
            'timestamp',
            'previousBlock',
            'entryPage',
            'directoryBlock',
            '__typename'
        ]);
        assert.hasAllDeepKeys(chains[0].entryPage, [
            'pageLength',
            'offset',
            'totalCount',
            'entries',
            '__typename'
        ]);
        assert.hasAllDeepKeys(chains[0].entryPage.entries[0], ['content', '__typename']);
        assert.hasAllDeepKeys(chains[0].directoryBlock, ['keyMR', '__typename']);
        chains.forEach((chain: any) => assert.strictEqual(chain.sequenceNumber, 0));
    }, 20000);

    it('Should be notified of a new entry block', async () => {
        const [_, target] = (await createChains(2)) as AddResponse[];
        const entryBlock = (await new Promise((resolve, reject) => {
            observable = apollo
                .subscribe({
                    query: SUBSCRIBE_NEW_EBLOCK,
                    variables: { chainId: target.chainId }
                })
                .subscribe({
                    error: reject,
                    next: (res: any) => resolve(res.data.newEntryBlock)
                });
        })) as any;
        assert.strictEqual(entryBlock.chainId, target.chainId);
        assert.hasAllDeepKeys(entryBlock, [
            'keyMR',
            'chainId',
            'sequenceNumber',
            'timestamp',
            'previousBlock',
            'entryPage',
            'directoryBlock',
            '__typename'
        ]);
        assert.hasAllDeepKeys(entryBlock.directoryBlock, ['keyMR', '__typename']);
        assert.hasAllDeepKeys(entryBlock.entryPage, ['entries', '__typename']);
        assert.hasAllDeepKeys(entryBlock.entryPage.entries[0], [
            'chainId',
            'content',
            '__typename'
        ]);
    }, 20000);

    it('Should be notified of a new factoid transaction', async () => {
        const destination = generateRandomFctAddress().public;
        await sendTransaction(destination);
        const tx = (await new Promise((resolve, reject) => {
            observable = apollo
                .subscribe({
                    query: SUBSCRIBE_NEW_TX,
                    variables: { address: destination }
                })
                .subscribe({
                    error: reject,
                    next: (res: any) => resolve(res.data.newFactoidTransaction)
                });
        })) as any;
        assert.strictEqual(tx.factoidOutputs[0].address, destination);
        assert.isString(tx.hash);
        assert.isNumber(tx.timestamp);
        assert.isNumber(tx.totalInputs);
        assert.isNumber(tx.totalFactoidOutputs);
        assert.isNumber(tx.totalEntryCreditOutputs);
        assert.strictEqual(tx.fees, tx.totalInputs - tx.totalFactoidOutputs);
        tx.rcds.forEach(assert.isString);
        tx.signatures.forEach(assert.isString);
        assert.isString(tx.factoidBlock.keyMR);
        assert.isString(tx.factoidBlock.ledgerKeyMR);
    }, 20000);
});
