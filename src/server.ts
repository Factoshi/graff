import { ApolloServer, gql } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { resolvers } from './resolvers';
import { FactomdDataLoader } from './data_loader';
import { cli } from './factom';
import { Context } from './types/server';
import { resolve } from 'path';

// Create typeDefs
const schema = importSchema(resolve(__dirname, '../schema.graphql'));
const typeDefs = gql`
    ${schema}
`;

// Make context type declaration explicit to ensure compiler enforces consistency
// between the server and the type file generated by GraphQL Codegen.
const context = (): Context => ({
    // Batches and caches factomd requests. New instance created per request to avoid
    // memory leak.
    factomd: new FactomdDataLoader(cli)
});

// Create server.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
});

// Launch server
server.listen().then(({ url }) => console.log(`Server ready at ${url} 🚀`));
