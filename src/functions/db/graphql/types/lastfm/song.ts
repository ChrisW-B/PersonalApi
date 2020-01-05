// db/graphql/types/Song.js

import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql/type';

export default new GraphQLObjectType({
  name: 'Song',
  description: "A Song I've Listened To",
  fields: () => ({
    title: { type: GraphQLString, description: 'The Song Name' },
    nowplaying: { type: GraphQLBoolean, description: 'Whether the song is currently playing' },
    artist: { type: GraphQLString, description: 'The Artist Name' },
  }),
});
