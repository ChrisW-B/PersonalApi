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
    /* eslint-disable @typescript-eslint/require-await,no-param-reassign */
    async (event) => {
      let origin: string | undefined = event.headers.Origin;
      const host = event.headers.Host;
      if (!origin && host) {
        const isSecure = /^localhost:\d{1,5}$/.test(host);
        origin = `${isSecure ? 'https' : 'http'}://${host}`;
      } else if (!origin) {
        origin = '*';
      }
      return async (result) => {
        if (event.httpMethod.toUpperCase() === 'OPTIONS') {
          result.statusCode = 200;
          result.body = '';
        }
        result.headers = {
          ...result.headers,
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': origin ?? '*',
        };
      };
    },
    /* eslint-enable @typescript-eslint/require-await,arrow-body-style,no-param-reassign */
  ],
});
