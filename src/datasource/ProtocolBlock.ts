import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { FactomCli } from 'factom';
import { Context } from '../types/server';
import { KeyValueCache } from 'apollo-server-core';
import { handleBlockError } from '../resolvers/resolver-helpers';

enum HeightPrefix {
    ABlock = 'ABlock',
    DBlock = 'DBlock',
    ECBlock = 'ECBlock',
    FBlock = 'FBlock'
}

export class ProtocolBlockSource<C = Context> extends DataSource<C> {
    private cache!: KeyValueCache;

    constructor(private cli: FactomCli) {
        super();
    }

    initialize(config: DataSourceConfig<C>) {
        this.cache = config.cache;
    }

    /**
     * Deterministically create a unique pointer to a block. Useful for creating a pointer to a block
     * from its height, as the height is not unique.
     */
    private createHeightRef(prefix: HeightPrefix, height: number) {
        return prefix + '-' + height.toString();
    }

    private tryParseBlock(maybeJson: string) {
        try {
            const block = JSON.parse(maybeJson);
            return block;
        } catch (e) {}
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
        key: string | number,
        prefix: HeightPrefix,
        callFactomd: (key: string | number) => Promise<T>
    ) {
        let blockOrPointer: string | undefined;
        if (typeof key === 'number') {
            const heightRef = this.createHeightRef(prefix, key);
            blockOrPointer = await this.cache.get(heightRef);
        } else {
            blockOrPointer = await this.cache.get(key);
        }
        if (blockOrPointer !== undefined) {
            // determine whether the requested item is a hash or a block.
            let blockFromKey = this.tryParseBlock(blockOrPointer);
            // If its a block, return it.
            if (blockFromKey) {
                return { block: blockFromKey as T, fromCache: true };
            }
            const pointer = blockOrPointer;
            const blockFromPointer = await this.cache.get(pointer);
            if (blockFromPointer !== undefined) {
                return { block: JSON.parse(blockFromPointer) as T, fromCache: true };
            }
        }
        const block = await callFactomd(key).catch(handleBlockError);
        return { block, fromCache: false };
    }

    private async getAndSetBlock<T>(
        blockRef: string | number,
        primaryKey: string,
        heightPath: string,
        prefix: HeightPrefix,
        callFactomd: (key: string | number) => Promise<T>,
        secondaryKeys: string[] = []
    ): Promise<T | null> {
        // Get the block.
        const { block, fromCache }: any = await this.getBlock(
            blockRef,
            prefix,
            callFactomd
        );
        // If it did not come from the cache and is not null, set it on the cache.
        if (!fromCache && block !== null) {
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
            this.cli.getAdminBlock.bind(this.cli),
            ['lookupHash']
        );
    }

    getDirectoryBlock(blockRef: string | number) {
        return this.getAndSetBlock(
            blockRef,
            'keyMR',
            'height',
            HeightPrefix.DBlock,
            this.cli.getDirectoryBlock.bind(this.cli)
        );
    }

    getEntryCreditBlock(blockRef: string | number) {
        return this.getAndSetBlock(
            blockRef,
            'headerHash',
            'directoryBlockHeight',
            HeightPrefix.ECBlock,
            this.cli.getEntryCreditBlock.bind(this.cli),
            ['fullHash']
        );
    }

    getFactoidBlock(blockRef: string | number) {
        return this.getAndSetBlock(
            blockRef,
            'keyMR',
            'directoryBlockHeight',
            HeightPrefix.FBlock,
            this.cli.getFactoidBlock.bind(this.cli),
            ['ledgerKeyMR']
        );
    }
}
