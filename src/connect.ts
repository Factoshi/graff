import { FactomCli, FactomEventEmitter } from 'factom';
import {
    FACTOMD_PORT,
    FACTOMD_HOST,
    FACTOMD_PATH,
    FACTOMD_USER,
    FACTOMD_PASSWD,
    FACTOMD_PROTOCOL,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_FAMILY,
    REDIS_PASSWD,
    REDIS_DB
} from './contants';
import { RedisCache } from 'apollo-server-cache-redis';
import { InMemoryLRUCache } from 'apollo-server-caching';

// Factom

export const factomCli = new FactomCli({
    host: FACTOMD_HOST,
    port: FACTOMD_PORT,
    path: FACTOMD_PATH,
    user: FACTOMD_USER,
    password: FACTOMD_PASSWD,
    protocol: FACTOMD_PROTOCOL
});

export const factomEmitter = new FactomEventEmitter(factomCli);

// Redis cache

export const cache = REDIS_HOST
    ? new RedisCache({
          port: REDIS_PORT,
          host: REDIS_HOST,
          family: REDIS_FAMILY,
          password: REDIS_PASSWD,
          db: REDIS_DB
      })
    : new InMemoryLRUCache();

// Startup tests

export const waitForCache = () => {
    return new Promise((resolve, reject) => {
        if (cache instanceof RedisCache) {
            cache.client.on('error', reject);
            cache.client.on('connect', resolve);
        } else {
            resolve();
        }
    });
};

export const testFactomd = async () => {
    const heights = await factomCli.getHeights();
    if (heights.leaderHeight > heights.directoryBlockHeight + 1) {
        throw new Error('Factomd is not fully synced.');
    }
};
