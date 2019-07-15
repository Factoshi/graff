import { FactomCli, FactomEventEmitter } from 'factom';
import {
    FACTOMD_PORT,
    FACTOMD_HOST,
    FACTOMD_PATH,
    FACTOMD_USER,
    FACTOMD_PASSWD,
    FACTOMD_PROTOCOL
} from './contants';

export const cli = new FactomCli({
    host: FACTOMD_HOST,
    port: FACTOMD_PORT ? parseInt(FACTOMD_PORT) : 8088,
    path: FACTOMD_PATH || '/v2',
    user: FACTOMD_USER,
    password: FACTOMD_PASSWD,
    protocol: FACTOMD_PROTOCOL || 'http'
});

export const factomEmitter = new FactomEventEmitter(cli);
