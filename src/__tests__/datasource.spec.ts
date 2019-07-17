import { cli } from '../factom';
import { FactomdDataSource } from '../dataSource';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { randomBytes } from 'crypto';
import { generateRandomEcAddress, generateRandomFctAddress } from 'factom';
import { handleBlockError } from '../resolvers/resolver-helpers';

const datasource = new FactomdDataSource(cli);
const cache = new InMemoryLRUCache();
datasource.initialize({
    cache,
    context: {} as any
});

describe('Test Protocol Block Datasources', () => {
    const cliSpy = jest.spyOn(cli, 'getDirectoryBlock');
    const setCacheSpy = jest.spyOn(cache, 'set');
    const getCacheSpy = jest.spyOn(cache, 'get');
    const HASH = '363a31b2b50980ef7098a3538b729b4cf54fc7d408a2084226187bd0e217bec8';
    const HEIGHT = 201519;

    afterEach(() => {
        jest.clearAllMocks();
        return cache.flush();
    });

    it('Should fetch a directory block from blockchain by HASH then from the cache by HASH', async () => {
        // Get the block from the blockchain
        const fromBlockchain = await datasource.getDirectoryBlock(HASH);
        expect(fromBlockchain!.keyMR).toBe(HASH);
        // Called once to see if the block is present in the cache
        expect(getCacheSpy).toHaveBeenCalledTimes(1);
        // Call the blockchain to get the actual block.
        expect(cliSpy).toHaveBeenCalledTimes(1);
        // Called once for the directory block and once for the height reference
        expect(setCacheSpy).toHaveBeenCalledTimes(2);

        // Get the block from the cache
        const fromCache = await datasource.getDirectoryBlock(HASH);
        expect(fromCache).toEqual(fromBlockchain);
        // Called a second time to get the item from the cache.
        expect(getCacheSpy).toHaveBeenCalledTimes(2);
        // It should have been present, so this will not be set again.
        expect(cliSpy).toHaveBeenCalledTimes(1);
        // Again, this should not have been called again.
        expect(setCacheSpy).toHaveBeenCalledTimes(2);
    });

    it('Should fetch a directory block from blockchain by HASH then from the cache by HEIGHT', async () => {
        // Get the block from the blockchain
        const fromBlockchain = await datasource.getDirectoryBlock(HASH);
        expect(fromBlockchain!.keyMR).toBe(HASH);
        // Called once to see if the block is present in the cache
        expect(getCacheSpy).toHaveBeenCalledTimes(1);
        // Call the blockchain to get the actual block.
        expect(cliSpy).toHaveBeenCalledTimes(1);
        // Called once for the directory block and once for the height reference
        expect(setCacheSpy).toHaveBeenCalledTimes(2);

        // Get the block from the cache
        const fromCache = await datasource.getDirectoryBlock(HEIGHT);
        expect(fromCache!.keyMR).toBe(fromBlockchain!.keyMR);
        // Called twice more. Once to get the reference and once to get the block.
        expect(getCacheSpy).toHaveBeenCalledTimes(3);
        // The block should have been fetched from the cache, so this should not be called again.
        expect(cliSpy).toHaveBeenCalledTimes(1);
        // Nothing to set on the cache so this will not have been called again.
        expect(setCacheSpy).toHaveBeenCalledTimes(2);
    });

    it('Should fetch a directory block from blockchain by HEIGHT then from the cache by HASH', async () => {
        // Get the block from the blockchain
        const fromBlockchain = await datasource.getDirectoryBlock(HEIGHT);
        expect(fromBlockchain!.keyMR).toBe(HASH);
        // Called once to see if the block is present in the cache
        expect(getCacheSpy).toHaveBeenCalledTimes(1);
        // Call the blockchain to get the actual block.
        expect(cliSpy).toHaveBeenCalledTimes(1);
        // Called once for the directory block and once for the height reference
        expect(setCacheSpy).toHaveBeenCalledTimes(2);

        // Get the block from the cache
        const fromCache = await datasource.getDirectoryBlock(HASH);
        expect(fromCache).toEqual(fromBlockchain);
        // Called once more to get the block out of the cache.
        expect(getCacheSpy).toHaveBeenCalledTimes(2);
        // Neither of these should have been called again.
        expect(cliSpy).toHaveBeenCalledTimes(1);
        expect(setCacheSpy).toHaveBeenCalledTimes(2);
    });

    it('Should fetch a directory block from blockchain by HEIGHT then from the cache by HEIGHT', async () => {
        // Get the block from the blockchain
        const fromBlockchain = await datasource.getDirectoryBlock(HEIGHT);
        expect(fromBlockchain!.keyMR).toBe(HASH);
        // Called once to see if the block is present in the cache
        expect(getCacheSpy).toHaveBeenCalledTimes(1);
        // Call the blockchain to get the actual block.
        expect(cliSpy).toHaveBeenCalledTimes(1);
        // Called once for the directory block and once for the height reference
        expect(setCacheSpy).toHaveBeenCalledTimes(2);

        // Get the block from the cache
        const fromCache = await datasource.getDirectoryBlock(HEIGHT);
        expect(fromCache).toEqual(fromBlockchain);
        // Called twice more. Once to get the reference and once to get the block.
        expect(getCacheSpy).toHaveBeenCalledTimes(3);
        // Neither of these should have been called again.
        expect(cliSpy).toHaveBeenCalledTimes(1);
        expect(setCacheSpy).toHaveBeenCalledTimes(2);
    });

    it('Should be able to fetch the directory block by height if HEIGHT is present in the cache but HASH is not', async () => {
        // Get the block from the blockchain
        const fromBlockchain = await datasource.getDirectoryBlock(HASH);
        expect(fromBlockchain!.keyMR).toBe(HASH);
        expect(getCacheSpy).toHaveBeenCalledTimes(1);
        expect(cliSpy).toHaveBeenCalledTimes(1);
        expect(setCacheSpy).toHaveBeenCalledTimes(2);

        // Remove the directory block from the cache but leave the height.
        await cache.delete(HASH);

        // Get the block from the cache
        const fromCache = await datasource.getDirectoryBlock(HEIGHT);
        expect(fromCache!.keyMR).toBe(fromBlockchain!.keyMR);
        // Called twice more, once to get the height, then again to get the hash.
        expect(getCacheSpy).toHaveBeenCalledTimes(3);
        // Hash was not there, even though the height was, so now fetch block from the blockchain again.
        expect(cliSpy).toHaveBeenCalledTimes(2);
        // Double the calls to the cache as everything is reset.
        expect(setCacheSpy).toHaveBeenCalledTimes(4);
    });

    it('Should fetch directory block head and set the response on the cache', async () => {
        const headSpy = jest.spyOn(cli, 'getDirectoryBlockHead');

        const fromBlockchain = await datasource.getDirectoryBlockHead();
        expect(fromBlockchain!.keyMR).toBeDefined();
        expect(getCacheSpy).toHaveBeenCalledTimes(0);
        expect(headSpy).toHaveBeenCalledTimes(1);
        expect(setCacheSpy).toHaveBeenCalledTimes(2);

        // Get that block from the cache
        const fromCache = await datasource.getDirectoryBlock(fromBlockchain!.keyMR);
        expect(fromCache!.keyMR).toBe(fromBlockchain!.keyMR);
        expect(getCacheSpy).toHaveBeenCalledTimes(1);
        expect(cliSpy).toHaveBeenCalledTimes(0);
        expect(setCacheSpy).toHaveBeenCalledTimes(2);
    });

    it('Should return null for missing HASH and  NOT save that to the cache', async () => {
        const fakeBlock = randomBytes(32).toString('hex');
        const fromBlockchain = await datasource
            .getDirectoryBlock(fakeBlock)
            .catch(handleBlockError);
        expect(fromBlockchain).toBeNull();
        // Called once to see if the block is present in the cache
        expect(getCacheSpy).toHaveBeenCalledTimes(1);
        // Call the blockchain to get the actual block.
        expect(cliSpy).toHaveBeenCalledTimes(1);
        // Called once for the directory block
        expect(setCacheSpy).toHaveBeenCalledTimes(0);
    });

    it('Should return null for missing HEIGHT and NOT save that to the cache', async () => {
        const fakeBlock = Number.MAX_SAFE_INTEGER;
        const fromBlockchain = await datasource
            .getDirectoryBlock(fakeBlock)
            .catch(handleBlockError);
        expect(fromBlockchain).toBeNull();
        expect(getCacheSpy).toHaveBeenCalledTimes(1);
        expect(cliSpy).toHaveBeenCalledTimes(1);
        expect(setCacheSpy).toHaveBeenCalledTimes(0);
    });

    it('Should query an admin block by lookupHash then get it from the cache with backReferenceHash', async () => {
        const cliSpy = jest.spyOn(cli, 'getAdminBlock');
        const backReferenceHash =
            'f0ea0eeb90e669842ddbcf892d1b139b50a663541455fdc88630c00bf267fe6e';
        const lookupHash =
            '7c63a30640b339f97177df500fd51b104f3748e1be773888d8bdfe0728620778';

        const fromBlockchain = await datasource.getAdminBlock(lookupHash);
        expect(fromBlockchain!.backReferenceHash).toBe(backReferenceHash);
        expect(getCacheSpy).toHaveBeenCalledTimes(1);
        expect(cliSpy).toHaveBeenCalledTimes(1);
        expect(setCacheSpy).toHaveBeenCalledTimes(3);

        const fromCache = await datasource.getDirectoryBlock(backReferenceHash);
        expect(fromCache).toEqual(fromBlockchain);
        // backReferenceHash is the primary key, so this should only need to make one additional request.
        // everything else will remain the same.
        expect(getCacheSpy).toHaveBeenCalledTimes(2);
        expect(cliSpy).toHaveBeenCalledTimes(1);
        expect(setCacheSpy).toHaveBeenCalledTimes(3);
    });

    it('Should query an admin block by backReferenceHash then get it from the cache with lookupHash', async () => {
        const cliSpy = jest.spyOn(cli, 'getAdminBlock');
        const backReferenceHash =
            'f0ea0eeb90e669842ddbcf892d1b139b50a663541455fdc88630c00bf267fe6e';
        const lookupHash =
            '7c63a30640b339f97177df500fd51b104f3748e1be773888d8bdfe0728620778';

        const fromBlockchain = await datasource.getAdminBlock(backReferenceHash);
        expect(fromBlockchain!.backReferenceHash).toBe(backReferenceHash);
        expect(getCacheSpy).toHaveBeenCalledTimes(1);
        expect(cliSpy).toHaveBeenCalledTimes(1);
        expect(setCacheSpy).toHaveBeenCalledTimes(3);

        const fromCache = await datasource.getDirectoryBlock(lookupHash);
        expect(fromCache).toEqual(fromBlockchain);
        // This time there will be an additional call to the cache, as it needs to deference
        // the backReferenceHash before looking it up.
        expect(getCacheSpy).toHaveBeenCalledTimes(3);
        expect(cliSpy).toHaveBeenCalledTimes(1);
        expect(setCacheSpy).toHaveBeenCalledTimes(3);
    });
});

describe('Test Non-Protocol Block Datasource', () => {
    const setCacheSpy = jest.spyOn(cache, 'set');
    const getCacheSpy = jest.spyOn(cache, 'get');

    afterEach(() => {
        jest.clearAllMocks();
        return cache.flush();
    });

    it('Should get several balances and set them on the cache', async () => {
        const cliBalanceSpy = jest.spyOn(cli, 'getBalance');
        const addresses = [
            'FA2tUk6LNzNsdzCbxmac1Kx9wpU9wS7GSoME5BTosK4zAUBM1gEC',
            'EC1zANmWuEMYoH6VizJg6uFaEdi8Excn1VbLN99KRuxh3GSvB7YQ',
            generateRandomEcAddress().public,
            generateRandomFctAddress().public
        ];
        const fromBlockchain = await datasource.getBalances(addresses);
        expect(Array.isArray(fromBlockchain)).toBe(true);
        expect(fromBlockchain).toHaveLength(4);
        expect(getCacheSpy).toHaveBeenCalledTimes(4);
        expect(cliBalanceSpy).toHaveBeenCalledTimes(4);
        expect(setCacheSpy).toHaveBeenCalledTimes(4);

        const fromCache = await datasource.getBalances(addresses);
        expect(Array.isArray(fromCache)).toBe(true);
        expect(fromCache).toHaveLength(4);
        expect(getCacheSpy).toHaveBeenCalledTimes(8);
        expect(cliBalanceSpy).toHaveBeenCalledTimes(4);
        expect(setCacheSpy).toHaveBeenCalledTimes(4);
    });
});
