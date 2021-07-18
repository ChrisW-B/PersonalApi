import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-lambda';

import schema from './db/graphql';

const server = new ApolloServer({
  schema,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
exports.handler = server.createHandler({
  expressGetMiddlewareOptions: { cors: { origin: '*', credentials: true } },
});
