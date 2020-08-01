// db/graphql/types/Song.js

import { GraphQLObjectType, GraphQLString } from 'graphql/type';

import SpotifyAlbum from './album';

export default new GraphQLObjectType({
  name: 'SpotifyTrack',
  description: 'A Track in spotify',
  fields: () => ({
    title: { type: GraphQLString, description: 'The Track Name' },
    spotifyId: { type: GraphQLString, description: 'The unique id provided by spotify' },
    artist: { type: GraphQLString, description: 'The Artist Name' },
    dateAdded: { type: GraphQLString, description: 'The date added to spotify' },
    link: { type: GraphQLString, description: 'a link to the track in spotify' },
    album: { type: SpotifyAlbum },
  }),
});
