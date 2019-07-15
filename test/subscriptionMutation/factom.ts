import config from './.factomds.json';
import { FactomCli } from 'factom';

export const cli = new FactomCli({ port: config.factomd.apiPort });
