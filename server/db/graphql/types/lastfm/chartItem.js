// db/graphql/types/ChartItem.js
import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql/type';

const ChartItem = new GraphQLObjectType({
  name: 'chartItem',
  description: 'An item on most played chart',
  fields: () => ({
    name: { type: GraphQLString, description: 'The item name, dependent on what kind of query (either album or song)' },
    artist: { type: GraphQLString, description: 'The artist for the song or album' },
    playcount: { type: GraphQLInt, description: 'How many times the item has been played in the given time period' },
  }),
});

export default ChartItem;
