// db/graphql/types/Song.js

import { GraphQLBoolean, GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql/type';

const song = new GraphQLObjectType({
  name: 'Song',
  description: "A Song I've Listened To",
  fields: () => ({
    title: { type: GraphQLString, description: 'The Song Name' },
    nowplaying: { type: GraphQLBoolean, description: 'Whether the song is currently playing' },
    artist: { type: GraphQLString, description: 'The Artist Name' },
    image: { type: GraphQLString, description: 'A link to LastFM Album Art' },
    id: { type: GraphQLID, description: 'A unique ID' },
  }),
});
export default song;
