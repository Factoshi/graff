import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { FactomCli, DirectoryBlock } from 'factom';
import { Context } from './types/server';
import { KeyValueCache } from 'apollo-server-core';
import promise from 'bluebird';
import { MutationMethod } from './constants';

enum HeightPrefix {
    ABlock = 'ABlock',
    DBlock = 'DBlock',
    ECBlock = 'ECBlock',
    FBlock = 'FBlock'
}

export class FactomdDataSource<C = Context> extends DataSource<C> {
    private cache!: KeyValueCache;

    constructor(private cli: FactomCli) {
        super();
    }

    initialize(config: DataSourceConfig<C>) {
        this.cache = config.cache;
        return this;
    }

    private tryParse(maybeJson: string) {
        try {
            const json = JSON.parse(maybeJson);
            return json;
        } catch (e) {
            const msg = `Corrupted cache: tried to parse invalid JSON. Please flush the cache and try again.`;
            msg.concat(`\n Invalid JSON: ${maybeJson}`);
            throw new Error(msg);
        }
    }

    /*********************
     *  Protocol Blocks  *
     ********************/

    private createHeightRef(prefix: HeightPrefix, height: number) {
        return prefix + '-' + height.toString();
    }

    private async setBlock(
        block: any,
        primaryKey: string,
        heightKey: string,
        secondaryKeys: string[]
    ) {
        return Promise.all([
            this.cache.set(block[primaryKey], JSON.stringify(block)),
            this.cache.set(heightKey, block[primaryKey]),
            secondaryKeys.map(sKey => this.cache.set(block[sKey], block[primaryKey]))
        ]);
    }

    private async getBlock<T>(
        // key will be undefined if the request is for a directory block head.
        key: string | number | undefined,
        prefix: HeightPrefix,
        callFactomd: () => Promise<T>
    ) {
        let cacheData: string | undefined;
        if (typeof key === 'number') {
            const heightRef = this.createHeightRef(prefix, key);
            cacheData = await this.cache.get(heightRef);
        } else if (typeof key === 'string') {
            cacheData = await this.cache.get(key);
        }
        if (cacheData !== undefined) {
            // Determine whether the cacheData is a pointer or a block.
            if (/^[A-Fa-f0-9]{64}$/g.test(cacheData)) {
                // cacheData is a pointer, so now we can use that to get the block.
                const blockFromCache = await this.cache.get(cacheData);
                // If the pointer didn't lead to anything, this block is skipped and the function
                // finished by fetching the data from factomd below.
                if (blockFromCache !== undefined) {
                    let block: T = this.tryParse(blockFromCache);
                    return { block, fromCache: true };
                }
            } else {
                const block: T = this.tryParse(cacheData);
                return { block, fromCache: true };
            }
        }
        // Factomd errors bubble up out of the datasource module.
        const block = await callFactomd();
        return { block, fromCache: false };
    }

    private async getAndSetBlock<T>(
        blockRef: string | number | undefined,
        primaryKey: string,
        heightPath: string,
        prefix: HeightPrefix,
        callFactomd: () => Promise<T>,
        secondaryKeys: string[] = []
    ): Promise<T> {
        // Get the block.
        const { block, fromCache }: any = await this.getBlock(
            blockRef,
            prefix,
            callFactomd
        );
        // If it did not come from the cache, set it on the cache.
        if (!fromCache) {
            const heightKey = this.createHeightRef(prefix, block[heightPath]);
            await this.setBlock(block, primaryKey, heightKey, secondaryKeys);
        }
        return block;
    }

    getAdminBlock(blockRef: string | number) {
        return this.getAndSetBlock(
            blockRef,
            'backReferenceHash',
            'directoryBlockHeight',
            HeightPrefix.ABlock,
            () => this.cli.getAdminBlock(blockRef),
            ['lookupHash']
        );
    }

    getDirectoryBlock(blockRef: string | number) {
        // prettier-ignore
        return this.getAndSetBlock(
            blockRef,
            'keyMR',
            'height',
            HeightPrefix.DBlock,
            () => this.cli.getDirectoryBlock(blockRef),
        );
    }

    getDirectoryBlockHead() {
        // prettier-ignore
        return this.getAndSetBlock(
            undefined,
            'keyMR',
            'height',
            HeightPrefix.DBlock,
            () => this.cli.getDirectoryBlockHead(),
        ) as Promise<DirectoryBlock>;
    }

    getEntryCreditBlock(blockRef: string | number) {
        return this.getAndSetBlock(
            blockRef,
            'headerHash',
            'directoryBlockHeight',
            HeightPrefix.ECBlock,
            () => this.cli.getEntryCreditBlock(blockRef),
            ['fullHash']
        );
    }

    getFactoidBlock(blockRef: string | number) {
        return this.getAndSetBlock(
            blockRef,
            'keyMR',
            'directoryBlockHeight',
            HeightPrefix.FBlock,
            () => this.cli.getFactoidBlock(blockRef),
            ['ledgerKeyMR']
        );
    }

    /***********************
     *  Remaining Queries  *
     **********************/

    private async getAndSet<T>(
        key: string,
        factomGet: () => Promise<T>,
        options?: { ttl: number }
    ): Promise<T> {
        const fromCache = await this.cache.get(key);
        if (fromCache !== undefined) {
            return this.tryParse(fromCache);
        }
        const fromBlockchain = await factomGet();
        if (fromBlockchain !== null) {
            await this.cache.set(key, JSON.stringify(fromBlockchain), options);
        }
        return fromBlockchain;
    }

    async getAck(key: { hash: string; chainid: string }) {
        const cacheKey = 'ack' + key.chainid + key.hash;
        const fromCache = await this.cache.get(cacheKey);
        if (fromCache !== undefined) {
            return JSON.parse(fromCache);
        }
        const ack = await this.cli.factomdApi('ack', key);
        await this.cache.set(cacheKey, JSON.stringify(ack), { ttl: 5 });
        return ack;
    }

    getBalances(addresses: string[]) {
        const factomGet = this.cli.getBalance.bind(this.cli);
        return promise.map(
            addresses,
            address => this.getAndSet(address, () => factomGet(address), { ttl: 5 }),
            { concurrency: 5 }
        );
    }

    getChainHead(chainId: string) {
        return this.getAndSet(chainId, () => this.cli.getChainHead(chainId), { ttl: 5 });
    }

    getCurrentMinute() {
        return this.cli.factomdApi('current-minute');
    }

    async getEntry(hash: string) {
        const fromCache = await this.cache.get(hash);
        if (fromCache !== undefined) {
            return this.tryParse(fromCache);
        }
        const entry = await this.cli.getEntryWithBlockContext(hash);
        const formattedEntry = {
            ...entry,
            chainId: entry.chainIdHex,
            content: entry.content.toString('base64'),
            extIds: entry.extIds.map(id => id.toString('base64')),
            hash
        };
        await this.cache.set(hash, JSON.stringify(formattedEntry));
        return formattedEntry;
    }

    getEntryBlock(hash: string) {
        return this.getAndSet(hash, () => this.cli.getEntryBlock(hash));
    }

    async getEntryCreditRate() {
        const cacheKey = 'eCRate';
        const cachedRate = await this.cache.get(cacheKey);
        if (cachedRate !== undefined) {
            return parseInt(cachedRate);
        }
        const blockchainRate = await this.cli.getEntryCreditRate();
        this.cache.set(cacheKey, blockchainRate.toString(), { ttl: 5 });
        return blockchainRate;
    }

    getHeights() {
        return this.cli.getHeights();
    }

    getPendingEntries(): Promise<any[]> {
        return this.cli.factomdApi('pending-entries');
    }

    getPendingTransactions(): Promise<any[]> {
        return this.cli.factomdApi('pending-transactions');
    }

    getProperties() {
        return this.getAndSet('properties', () => this.cli.factomdApi('properties'), {
            ttl: 3600
        });
    }

    async getReceipt(hash: string) {
        const cacheKey = 'receipt' + hash;
        const fromCache = await this.cache.get(cacheKey);
        if (fromCache !== undefined) {
            return this.tryParse(fromCache);
        }
        const receipt = await this.cli.factomdApi('receipt', { hash });
        if (receipt.receipt && receipt.receipt.bitcoinblockhash) {
            this.cache.set(cacheKey, JSON.stringify(receipt));
        } else {
            this.cache.set(cacheKey, JSON.stringify(receipt), { ttl: 300 });
        }
        return receipt;
    }

    async getTransaction(hash: string) {
        const fromCache = await this.cache.get(hash);
        if (fromCache !== undefined) {
            return this.tryParse(fromCache);
        }
        const tx = await this.cli.getTransaction(hash);
        const formattedTransaction = {
            ...tx,
            rcds: tx.rcds.map(rcd => rcd.toString('hex')),
            signatures: tx.signatures.map(s => s.toString('hex'))
        };
        await this.cache.set(hash, JSON.stringify(formattedTransaction));
        return formattedTransaction;
    }
    /**************************
     *  Everything Mutations  *
     **************************/

    async broadcastCommit(commit: string, method: MutationMethod) {
        const res = await this.cli.factomdApi(method, { message: commit });
        return {
            entryHash: res.entryhash,
            transactionHash: res.txid,
            chainIdHash: res.chainidhash || null
        };
    }

    async broadcastReveal(reveal: string, method: MutationMethod) {
        const res = await this.cli.factomdApi(method, { entry: reveal });
        return {
            entryHash: res.entryhash,
            chainId: res.chainid
        };
    }

    async add(
        payload: { commit: string; reveal: string },
        methods: { commit: MutationMethod; reveal: MutationMethod }
    ) {
        const commitRes = await this.broadcastCommit(payload.commit, methods.commit);
        const status = await this.cli.waitOnCommitAck(commitRes.transactionHash, 60);
        if (status !== 'TransactionACK') {
            throw new Error('Commit acknowledgement timed out.');
        }
        return this.broadcastReveal(payload.reveal, methods.reveal);
    }

    async submitTransaction(tx: string) {
        const res = await this.cli.factomdApi(MutationMethod.SubmitTx, {
            transaction: tx
        });
        return res.txid;
    }
}
