import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';

// NEW: this is the piece that turns individual subgraphs (currently just "auth")
// into one combined GraphQL API at /graphql
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'auth', url: 'http://auth-service:8083/graphql' },
    ],
  }),
});

const server = new ApolloServer({ gateway });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000, host: '0.0.0.0' },
});

console.log(`Apollo Gateway ready at ${url}`);