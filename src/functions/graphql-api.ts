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
      let origin = event.headers.Origin;
      if (origin === undefined) {
        const host = event.headers.Host ?? '';
        const isSecure = /^localhost:\d{1,5}$/.test(host);
        origin = `${isSecure ? 'https' : 'http'}://${host}`;
      }
      return async (result) => {
        result.headers = {
          ...result.headers,
          'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'access-control-allow-methods': '*',
          'access-control-allow-origin': origin ?? '*',
          'content-type': 'application/json',
        };
      };
    },
    /* eslint-enable @typescript-eslint/require-await,arrow-body-style,no-param-reassign */
  ],
});
