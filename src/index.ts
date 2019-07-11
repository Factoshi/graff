import { server } from './server';

/*******************
 *  Launch server  *
 ******************/
server.listen().then(({ url }) => console.log(`Server ready at ${url} 🚀`));

// TODO: figure out how to mitigate malicious queries
// TODO: add subscriptions
// TODO: add queries
// TODO: set up integration testing
// TODO: User config option for pagination limit
