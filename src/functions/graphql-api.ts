/* eslint-disable import/prefer-default-export */
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { handlers, startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda';

import schema from './db/graphql';

const server = new ApolloServer({
  schema,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

const apolloHandler = handlers.createAPIGatewayProxyEventRequestHandler();

export const handler = startServerAndCreateLambdaHandler(server, apolloHandler, {
  middleware: [
    /* eslint-disable @typescript-eslint/require-await,arrow-body-style,no-param-reassign */
    async (event) => {
      return async (result) => {
        event.headers = {
          ...result.headers,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Credentials': 'true',
        };
        result.headers = {
          ...result.headers,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Credentials': 'true',
        };
      };
    },
    /* eslint-enable @typescript-eslint/require-await,arrow-body-style,no-param-reassign */
  ],
});
