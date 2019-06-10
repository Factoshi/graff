import DataLoader from 'dataloader';
import factom from 'factom';

/**
 * Class holds dataloader instances to batch requests to factomd.
 */
export class FactomdDataLoader {
    constructor(private cli: factom.FactomCli) {}

    adminBlock = new DataLoader((hashes: (string | number)[]) => {
        return Promise.all(hashes.map(hash => this.cli.getAdminBlock(hash)));
    });

    chainHead = new DataLoader((chains: string[]) => {
        return Promise.all(chains.map(chain => this.cli.getChainHead(chain)));
    });

    directoryBlock = new DataLoader((hashes: (string | number)[]) => {
        return Promise.all(hashes.map(hash => this.cli.getDirectoryBlock(hash)));
    });

    // getDirectoryBlockHead does not take a key and therefore cannot use Dataloader.
    // The load method on this object creates a consistent API with the DataLoader instances.
    directoryBlockHead = {
        load: () => this.cli.getDirectoryBlockHead()
    };

    entryBlock = new DataLoader((hashes: string[]) => {
        return Promise.all(hashes.map(hash => this.cli.getEntryBlock(hash)));
    });

    entryCreditBlock = new DataLoader((hashes: (string | number)[]) => {
        return Promise.all(hashes.map(hash => this.cli.getEntryCreditBlock(hash)));
    });

    factoidBlock = new DataLoader((hashes: (string | number)[]) => {
        return Promise.all(hashes.map(hash => this.cli.getFactoidBlock(hash)));
    });
}