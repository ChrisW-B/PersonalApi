/* eslint-disable import/prefer-default-export,no-param-reassign */
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { handlers, startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda';

import schema from './db/graphql';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
};

const server = new ApolloServer({
  schema,
  introspection: true,
  csrfPrevention: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

export const handler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler(),
  {
    middleware: [
      // eslint-disable-next-line @typescript-eslint/require-await
      async (event) => async (result) => {
        result.headers = { ...result.headers, ...CORS_HEADERS };
        if (event.httpMethod.toUpperCase() === 'OPTIONS') {
          result.headers = CORS_HEADERS;
          result.statusCode = 200;
          result.body = '';
        } else if (event.httpMethod.toUpperCase() === 'HEAD') {
          result.headers = CORS_HEADERS;
          result.statusCode = 200;
          result.body = '';
        }
      },
    ],
  },
);
