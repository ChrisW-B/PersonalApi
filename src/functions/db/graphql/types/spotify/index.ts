import { GraphQLObjectType, GraphQLString } from 'graphql';

import PaginationArgType from '../../args/paginationArgs';
import PaginatedListType from '../utilityTypes/paginatedList';
import SpotifyAlbum from './album';
import SpotifyTrack from './track';

export default new GraphQLObjectType({
  name: 'Spotify',
  description: 'My Spotify Info',
  fields: () => ({
    likedTracks: {
      description: 'My liked songs in spotify',
      args: { pagination: { type: PaginationArgType, defaultValue: { offset: 0, first: 10 } } },
      type: PaginatedListType(SpotifyTrack),
      resolve: () => null,
    },
    likedAlbums: {
      description: 'My liked albums in spotify',
      args: { pagination: { type: PaginationArgType, defaultValue: { offset: 0, first: 10 } } },
      type: PaginatedListType(SpotifyAlbum),
      resolve: () => null,
    },
    nowPlaying: {
      description: 'The currently playing spotify track',
      type: SpotifyTrack,
      resolve: () => null,
    },
    url: { type: GraphQLString, description: 'My Spotify url', resolve: ({ url }) => url },
  }),
});
