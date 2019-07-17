import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragments.json';
import { getMainDefinition } from 'apollo-utilities';
import fetch from 'node-fetch';

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
    fetch: fetch as any
});

const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/graphql',
    options: { reconnect: true }
});

const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink
);

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
});

export const apollo = new ApolloClient({
    link,
    cache: new InMemoryCache({ fragmentMatcher })
});
