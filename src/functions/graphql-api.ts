import { ApolloServer } from 'apollo-server-lambda';

import schema from './db/graphql';

const server = new ApolloServer({ schema, playground: true, introspection: true });

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
exports.handler = server.createHandler({ cors: { origin: '*', credentials: true } });
