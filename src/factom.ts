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
    port: FACTOMD_PORT,
    path: FACTOMD_PATH,
    user: FACTOMD_USER,
    password: FACTOMD_PASSWD,
    protocol: FACTOMD_PROTOCOL
});

export const factomEmitter = new FactomEventEmitter(cli);
