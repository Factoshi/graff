import { testFactomd, waitForCache } from './connect';
import { server } from './server';

const exit = () => {
    console.log('Bye!');
    process.exit(0);
};
process.on('SIGTERM', exit);
process.on('SIGINT', exit);

(async () => {
    try {
        // Ensure that factomd and the cache are ready.
        await Promise.all([testFactomd(), waitForCache()]);

        // Launch the server
        const serverInfo = await server.listen();
        console.log(`Server ready at ${serverInfo.url} 🚀`);
    } catch (e) {
        console.error('Launch failed. Please see error output.');
        console.error(e);
        process.exit(1);
    }
})();
