// db/graphql/types/Song.js

import { GraphQLObjectType, GraphQLString } from 'graphql/type';

export default new GraphQLObjectType({
  name: 'SpotifyAlbum',
  description: 'A album in spotify',
  fields: () => ({
    title: { type: GraphQLString, description: 'The album Name' },
    spotifyId: { type: GraphQLString, description: 'The unique id provided by spotify' },
    artist: { type: GraphQLString, description: 'The Artist Name' },
    dateAdded: { type: GraphQLString, description: 'The date added to spotify' },
    link: { type: GraphQLString, description: 'a link to the album in spotify' },
  }),
});
