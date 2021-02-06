import { GraphQLList, GraphQLObjectType } from 'graphql/type';

import RangedInt from './rangedInt';

const PaginatedListType = (ItemType: GraphQLObjectType, min = 0, max = 50): GraphQLObjectType =>
  new GraphQLObjectType({
    name: `Paginated${ItemType}`,
    fields: { count: { type: RangedInt(min, max) }, items: { type: new GraphQLList(ItemType) } },
  });

export default PaginatedListType;
