import { GraphQLInputObjectType, GraphQLInt } from 'graphql/type';

const PaginationArgType = new GraphQLInputObjectType({
  name: 'PaginationArg',
  fields: {
    offset: { type: GraphQLInt, description: 'Skip n rows.' },
    first: { type: GraphQLInt, description: 'First n rows after the offset.' },
  },
});
export default PaginationArgType;
