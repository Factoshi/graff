import DataLoader from 'dataloader';
import Factom from 'factom';

/**
 * Class holds dataloader instances to batch requests to factomd.
 */
export class FactomdDataLoader {
    constructor(private cli: Factom.FactomCli) {}

    private createDataloader<K, V>(fetch: Function) {
        return new DataLoader<K, V>(keys => Promise.all(keys.map(key => fetch(key))));
    }

    // Some methods do not take a key and therefore cannot use Dataloader.
    // The load method on this object creates a consistent API with the DataLoader instances.
    private createMockDataLoader<T>(fetch: () => Promise<T>) {
        return { load: () => fetch() };
    }

    adminBlock = this.createDataloader<string | number, Factom.AdminBlock>(
        this.cli.getAdminBlock.bind(this.cli)
    );

    chainHead = this.createDataloader<string, Factom.EntryBlock>(
        this.cli.getChainHead.bind(this.cli)
    );

    currentMinute = this.createMockDataLoader(() =>
        this.cli.factomdApi('current-minute')
    );

    directoryBlock = this.createDataloader<string | number, Factom.DirectoryBlock>(
        this.cli.getDirectoryBlock.bind(this.cli)
    );

    directoryBlockHead = this.createMockDataLoader(
        this.cli.getDirectoryBlockHead.bind(this.cli)
    );

    entry = this.createDataloader<string, Factom.Entry>(
        this.cli.getEntryWithBlockContext.bind(this.cli)
    );

    entryBlock = this.createDataloader<string, Factom.EntryBlock>(
        this.cli.getEntryBlock.bind(this.cli)
    );

    entryCreditBlock = this.createDataloader<string | number, Factom.EntryCreditBlock>(
        this.cli.getEntryCreditBlock.bind(this.cli)
    );

    factoidBlock = this.createDataloader<string | number, Factom.FactoidBlock>(
        this.cli.getFactoidBlock.bind(this.cli)
    );
}
