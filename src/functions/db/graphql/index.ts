// db/graphql/index.js

import { GraphQLSchema } from 'graphql/type';

import query from '~/graphql/queries';

const schema = new GraphQLSchema({ query });

export default schema;
