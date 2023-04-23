/* eslint-disable import/prefer-default-export */
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import {
  handlers,
  middleware,
  startServerAndCreateLambdaHandler,
} from '@as-integrations/aws-lambda';

import schema from './db/graphql';

const server = new ApolloServer({
  schema,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

const apolloHandler = handlers.createAPIGatewayProxyEventRequestHandler();

const corsMiddleware: middleware.MiddlewareFn<typeof apolloHandler> =
  // eslint-disable-next-line @typescript-eslint/require-await
  async () => async (result) => {
    // eslint-disable-next-line no-param-reassign
    result.headers = {
      ...result.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    };
    return Promise.resolve();
  };

export const handler = startServerAndCreateLambdaHandler(server, apolloHandler, {
  middleware: [corsMiddleware],
});
