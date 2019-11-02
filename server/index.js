// server/index.js

import { ApolloServer } from 'apollo-server';
import env from 'dotenv';

import schema from './db/graphql';

env.config();

const server = new ApolloServer({ schema, tracing: true });
server.listen(process.env.PORT || 8080).then(s => console.log(`Server is running at ${s.url}`));
