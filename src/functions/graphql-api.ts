/* eslint-disable unicorn/filename-case */

import { ApolloServer } from 'apollo-server-lambda';

import schema from './db/graphql';

const server = new ApolloServer({ schema, playground: true, introspection: true });
exports.handler = server.createHandler({ cors: { origin: '*', credentials: true } });
