import { ApolloServer, gql, AuthenticationError } from 'apollo-server';
import { RedisCache } from 'apollo-server-cache-redis';
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
    MAX_COMPLEXITY
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
const constructContextForSubscriptions = (connection: ExecutionParams) => ({
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
    // Cache may either be Redis or InMemoryLRU. See top of file for definition.
    cache,
    dataSources: () => ({ factomd: new FactomdDataSource(factomCli) }),
    // If connection is not a subscription and thus auth will be handled by the onConnect subscription lifecycle method.
    // Explicit any because Apollo typings are currently wrong and do not specify the connection key on the argument object.
    // Will remove when fixed: https://github.com/apollographql/apollo-server/pull/2959
    context: ({ req, connection }: any) => {
        return connection !== undefined
            ? constructContextForSubscriptions(connection)
            : createContext(req);
    },
    // Subscription lifecycle methods.
    subscriptions: { onConnect },
    // mitigate malicious queries with validation rules. Can be configured with env vars.
    validationRules: [
        depthLimit(MAX_QUERY_DEPTH),
        // See https://github.com/4Catalyzer/graphql-validation-complexity for details on this rule.
        createComplexityLimitRule(MAX_COMPLEXITY)
    ]
});
