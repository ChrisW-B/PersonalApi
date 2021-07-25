/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-lambda';

import schema from './db/graphql';

const server = new ApolloServer({
  schema,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const apolloHandler = server.createHandler();

const handler: typeof apolloHandler = async (
  event,
  context,
  cb,
): Promise<ReturnType<typeof apolloHandler>> => {
  event.requestContext = event.requestContext ? event.requestContext : {};
  event.version = event.version ? event.version : '1.0';
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await apolloHandler(event, context, cb);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log({ e });
    throw e;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
exports.handler = handler;
