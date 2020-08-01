import { GraphQLInt, GraphQLList, GraphQLObjectType } from 'graphql/type';

const PaginatedListType = (ItemType: GraphQLObjectType): GraphQLObjectType =>
  new GraphQLObjectType({
    name: `Paginated${ItemType}`,
    fields: { count: { type: GraphQLInt }, items: { type: new GraphQLList(ItemType) } },
  });

export default PaginatedListType;
