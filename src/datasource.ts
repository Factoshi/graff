import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { FactomCli } from 'factom';
import { Context } from './types/server';
import { KeyValueCache } from 'apollo-server-core';
import { handleBlockError } from './resolvers/resolver-helpers';

export class FactomdDataSource extends DataSource {
    private context!: Context;
    private cache!: KeyValueCache;

    constructor(private cli: FactomCli) {
        super();
    }

    initialize(config: DataSourceConfig<Context>) {
        this.context = config.context;
        this.cache = config.cache;
    }

    private async get<T>(key: string, factomGet: () => Promise<T>) {
        const fromCache = await this.cache.get(key);
        if (fromCache !== undefined) {
            return JSON.parse(fromCache) as T;
        }
        const fromBlockchain = await factomGet().catch(handleBlockError);
        if (fromBlockchain !== null) {
            this.cache.set(key, JSON.stringify(fromBlockchain));
        }
        return fromBlockchain;
    }

    private async getByHeight(height: number) {}

    async getDirectoryBlock(key: string) {
        const dBlock = await this.get(key, () => this.cli.getDirectoryBlock(key));
        if (dBlock !== null) {
            const heightKey = 'dblock' + dBlock.height.toString();
            this.cache.set(heightKey, dBlock.keyMR);
        }
        return dBlock;
    }

    async getDirectoryBlockByHeight(height: number) {
        const key = await this.cache.get('dblock' + height.toString());
        if (key !== undefined) {
            return this.get(key, () => this.cli.getDirectoryBlock(key));
        }
        const directoryBlock = await this.cli.getDirectoryBlock(height);
    }
}
