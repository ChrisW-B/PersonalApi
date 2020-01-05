// db/graphql/index.js

import { GraphQLSchema } from 'graphql/type';

import query from './queries';

const schema = new GraphQLSchema({ query });

export default schema;
