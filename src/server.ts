import { ApolloServer, gql } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { resolvers } from './resolvers/resolvers';
import { FactomdDataLoader } from './data_loader';
import { cli } from './factom';
import { Context } from './types/server';

// Create typeDefs
const schema = importSchema('./schema.graphql');
const typeDefs = gql`
    ${schema}
`;

// Make context type declaration explicit to ensure compiler enforces consistency
// between the server and the generated type file.
const context: Context = {
    // Batches factomd requests.
    factomd: new FactomdDataLoader(cli)
};

// Create server.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
});

// Launch server
server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`));
