/* eslint-disable unicorn/filename-case */
// server/index.js

import { ApolloServer } from 'apollo-server-lambda';

import schema from './db/graphql';

// import env from 'dotenv';
// env.config();
const server = new ApolloServer({ schema, playground: true, introspection: true });
exports.handler = server.createHandler({ cors: { origin: '*', credentials: true } });
