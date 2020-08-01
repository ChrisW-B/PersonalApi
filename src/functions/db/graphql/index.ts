// db/graphql/index.js

import { GraphQLSchema } from 'graphql/type';

import query from './types/me';

const schema = new GraphQLSchema({ query });

export default schema;
