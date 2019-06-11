import DataLoader from 'dataloader';
import Factom from 'factom';

/**
 * Class holds dataloader instances to batch requests to factomd.
 */
export class FactomdDataLoader {
    constructor(private cli: Factom.FactomCli) {}

    private createDataLoader<K, V>(fetch: (key: K) => Promise<V>) {
        return new DataLoader<K, V>(keys => Promise.all(keys.map(key => fetch(key))));
    }

    // Some methods do not take a key and therefore cannot use Dataloader.
    // The load method on this object creates a consistent API with the DataLoader instances.
    private createMockDataLoader<T>(fetch: () => Promise<T>) {
        return { load: () => fetch() };
    }

    adminBlock = this.createDataLoader(this.cli.getAdminBlock.bind(this.cli));

    chainHead = this.createDataLoader(this.cli.getChainHead.bind(this.cli));

    currentMinute = this.createMockDataLoader(() =>
        this.cli.factomdApi('current-minute')
    );

    directoryBlock = this.createDataLoader(this.cli.getDirectoryBlock.bind(this.cli));

    directoryBlockHead = this.createMockDataLoader(
        this.cli.getDirectoryBlockHead.bind(this.cli)
    );

    entry = this.createDataLoader(this.cli.getEntryWithBlockContext.bind(this.cli));

    entryBlock = this.createDataLoader(this.cli.getEntryBlock.bind(this.cli));

    entryCreditBlock = this.createDataLoader(this.cli.getEntryCreditBlock.bind(this.cli));

    factoidBlock = this.createDataLoader(this.cli.getFactoidBlock.bind(this.cli));
}
