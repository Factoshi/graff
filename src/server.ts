import { GraphQLServer } from 'graphql-yoga';
import { resolvers } from './resolvers/resolvers';

// Create server.
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers
});

// Define server options.
const options = {
    port: 4000,
    bodyParserOptions: { type: 'application/json' }
};

// Start server.
server.start(options, () => console.log(`Server up on port ${options.port}`));
