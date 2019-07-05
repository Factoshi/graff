import { FactomCli, FactomEventEmitter } from 'factom';
import {
    factomdPort,
    factomdHost,
    factomdPath,
    factomdUser,
    factomdPasswd,
    factomdProto
} from './contants';

export const cli = new FactomCli({
    host: factomdHost,
    port: factomdPort ? parseInt(factomdPort) : 8088,
    path: factomdPath || '/v2',
    user: factomdUser,
    password: factomdPasswd,
    protocol: factomdProto || 'http'
});

export const factomEmitter = new FactomEventEmitter(cli);
