import { ApolloServer, gql, PubSub, AuthenticationError } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { resolvers } from './resolvers';
import { resolve } from 'path';
import { FACTOMD_PASSWD, FACTOMD_USER } from './contants';
import { Context } from './types/server';
import auth from 'basic-auth';
import { FactomdDataLoader } from './data_loader';
import { cli } from './factom';
import { compose } from 'ramda';
import { Request } from 'express';

// token should be a basic authorization string.
const authorize = (token: string | undefined) => {
    if (FACTOMD_PASSWD && FACTOMD_USER) {
        if (token === undefined) {
            throw new AuthenticationError('Must provide authorization token.');
        }
        const cred = auth.parse(token);
        if (cred === undefined) {
            const message = `${token} is not a valid basic auth string.`;
            throw new AuthenticationError(message);
        }
        if (cred.name !== FACTOMD_USER || cred.pass !== FACTOMD_PASSWD) {
            throw new AuthenticationError('Invalid credentials.');
        }
    }
};

/*********************
 *  Create context   *
 ********************/

const pubsub = new PubSub();

const createContextObject = (): Context => ({
    // Caches factomd requests. New instance created per request to avoid memory leak.
    factomd: new FactomdDataLoader(cli),
    pubsub
});

const extractAuthHeader = (req: Request) => req.headers.authorization;

const context = compose(
    createContextObject,
    authorize,
    extractAuthHeader
);

/********************************************
 *  Create Subscription Lifecycle Methods   *
 *******************************************/

const extractAuthParam = (connectionParams: any) => connectionParams.authToken;

const onConnect = compose(
    // If the connection makes it through authorization, it needs to return a truthy value.
    () => true,
    authorize,
    extractAuthParam
);

/*********************
 *  Create typeDefs  *
 ********************/
// import schema and parse
const schema = importSchema(resolve(__dirname, '../schema.graphql'));
const typeDefs = gql`
    ${schema}
`;

/*******************
 *  Create server  *
 ******************/
// bring it all together
export const server = new ApolloServer({
    typeDefs,
    resolvers,
    // If req is undefined then this is a subscription and thus auth will be handled
    // by the subscription lifecycle methods below.
    context: ({ req }) => (req !== undefined ? context(req) : createContextObject()),
    subscriptions: { onConnect }
});
