import { server } from './server';

/*******************
 *  Launch server  *
 ******************/
server.listen().then(({ url }) => console.log(`Server ready at ${url} 🚀`));

// TODO: Review Docker config
