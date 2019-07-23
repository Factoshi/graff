import { connectToCache, connectToFactomd } from './connect';
import { GQL_PORT } from './contants';
import { ApolloServer } from 'apollo-server';

const exit = () => {
    console.log('Bye!');
    process.exit(0);
};
process.on('SIGTERM', exit);
process.on('SIGINT', exit);

(async () => {
    try {
        // Ensure that factomd and the cache are ready.
        await connectToCache();
        await connectToFactomd();

        // If those two items do not throw, we can import the rest of the application.
        // Module is imported this way to prevent subscription listeners starting before
        // we're certain that factomd is ready for us.
        const { server }: { server: ApolloServer } = require('./server');

        // Launch the server.
        const serverInfo = await server.listen({ port: GQL_PORT });
        console.log(`Server ready at ${serverInfo.url} 🚀`);
    } catch (e) {
        console.error('Launch failed. Please see error output.');
        console.error(e);
        process.exit(1);
    }
})();
