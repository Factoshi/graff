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
} from './constants';
import { RedisCache } from 'apollo-server-cache-redis';
import { InMemoryLRUCache } from 'apollo-server-caching';
import retry from 'promise-retry';

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

// Cache

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

export const connectToCache = () => {
    cache instanceof RedisCache &&
        console.log(`Waiting for Redis at ${REDIS_HOST}:${REDIS_PORT}`);
    let attempt = 0;
    return new Promise((resolve, reject) => {
        if (cache instanceof RedisCache) {
            // Redis will automatically retry connections by itself, so we just need to listen for them.
            cache.client.on('error', (err: Error) => {
                if (attempt > 20) {
                    reject(err);
                }
                attempt++;
            });
            cache.client.on('connect', () => {
                console.log('Redis connected!');
                resolve();
            });
        } else {
            resolve();
        }
    });
};

// Factomd has the potential to have longer startup times than Redis, as it may need to check chainheads.
export const connectToFactomd = () => {
    const factomdUri = `${FACTOMD_PROTOCOL}://${FACTOMD_HOST}:${FACTOMD_PORT}`;
    console.log(`Waiting for factomd at ${factomdUri}.`);
    return retry(
        async (retry, attempt) => {
            try {
                if (attempt === 5) {
                    console.error('Still attempting to connect to factomd.');
                } else if (attempt === 7) {
                    console.error("Are you sure it's available?");
                } else if (attempt === 8) {
                    console.error('Final attempt...');
                }

                await factomCli.getHeights();
                console.log('Factomd connected!');
            } catch (err) {
                return retry(err);
            }
        },
        { retries: 8 }
    );
};
