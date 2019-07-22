import { ApolloServer, gql, AuthenticationError } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { resolvers } from './resolvers';
import { resolve } from 'path';
import auth from 'basic-auth';
import { factomCli, cache } from './connect';
import { compose } from 'ramda';
import { Request } from 'express';
import { FactomdDataSource } from './dataSource';
import depthLimit from 'graphql-depth-limit';
import { ConnectionContext, ExecutionParams } from 'subscriptions-transport-ws';
import {
    FACTOMD_PASSWD,
    FACTOMD_USER,
    MAX_QUERY_DEPTH,
    MAX_COMPLEXITY,
    GQL_PLAYGROUND,
    GQL_INTROSPEC
} from './contants';

const { createComplexityLimitRule } = require('graphql-validation-complexity');

// Token should be a basic authorization string. This authorization function is used by both websocket
// connections and standard http connection.
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

const extractAuthHeader = (req: Request) => req.headers.authorization;

const createContext = compose(
    // This is the context, but there is not currently anything to add to it manually, so return an empty object
    () => ({}),
    authorize,
    extractAuthHeader
);

// As of ApolloServer 2.6.9, datasources and the cache are not automatically added to the context of
// subscriptions. It is necessary to manually construct and add them here. See issue for recent status.
// https://github.com/apollographql/apollo-server/issues/1526
const createContextForSubscriptions = (connection: ExecutionParams) => ({
    dataSources: {
        factomd: new FactomdDataSource<ConnectionContext>(factomCli).initialize({
            cache,
            context: connection.context
        })
    }
});

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

/*******************
 *  Create server  *
 ******************/
// bring it all together
export const server = new ApolloServer({
    typeDefs: gql(importSchema(resolve(__dirname, '../schema.graphql'))),
    resolvers,
    cache,
    dataSources: () => ({ factomd: new FactomdDataSource(factomCli) }),
    // If connection defined then this is a subscription. Authentication is handled by the subscription lifecycle methods below.
    // Explicit any because Apollo typings are currently wrong and do not specify the connection key on the argument object.
    // Will remove when fixed: https://github.com/apollographql/apollo-server/pull/2959
    context: ({ req, connection }: any) => {
        return connection !== undefined
            ? createContextForSubscriptions(connection)
            : createContext(req);
    },
    subscriptions: { onConnect },
    validationRules: [
        depthLimit(MAX_QUERY_DEPTH),
        // See https://github.com/4Catalyzer/graphql-validation-complexity for details on this rule.
        createComplexityLimitRule(MAX_COMPLEXITY)
    ],
    playground: GQL_PLAYGROUND,
    introspection: GQL_INTROSPEC
});
