// server/index.js

import { ApolloServer } from 'apollo-server';
import env from 'dotenv';

import schema from './db/graphql';

env.config();

const server = new ApolloServer({ schema, tracing: true });
server.listen(4737);
