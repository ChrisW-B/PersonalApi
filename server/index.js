// server/index.js

import { ApolloServer } from 'apollo-server-lambda';
import env from 'dotenv';

import schema from './db/graphql';

env.config();

const server = new ApolloServer({ schema, playground: true, introspection: true });

exports.handler = server.createHandler({
  cors: {
    origin: [/\.?chrisb\.(me|xyz)/, /\.?chriswb\.dev/, /\.?chriswbarry\.com/, /localhost/],
    credentials: true,
  },
});
