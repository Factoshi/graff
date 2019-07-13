import { server } from './server';

/*******************
 *  Launch server  *
 ******************/
server.listen().then(({ url }) => console.log(`Server ready at ${url} 🚀`));

// TODO: figure out how to mitigate malicious queries
// TODO: User config option for pagination limit
// TODO: Review Docker config
// TODO: add subscription unit tests
// TODO: add mutations
// TODO: add mutation unit tests
// TODO: add mutation integration tests
