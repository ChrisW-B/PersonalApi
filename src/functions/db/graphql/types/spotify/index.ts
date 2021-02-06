import faunadb from 'faunadb';
import { GraphQLObjectType, GraphQLString } from 'graphql';
import SpotifyWebApi from 'spotify-web-api-node';

import PaginationArgType from '../../args/paginationArgs';
import PaginatedListType from '../utilityTypes/paginatedList';
import SpotifyAlbum from './album';
import SpotifyTrack from './track';

const FAUNA_DOC = '272767630896529920';

let spotifyClient: SpotifyWebApi;

const getSpotifyUserToken = async (): Promise<string> => {
  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env.FAUNA_TOKEN,
  });
  const response = await client.query<{ userName: string; token: string }>(
    q.Get(q.Ref(`/spotifyToken/spotifyTokens/${FAUNA_DOC}`)),
  );
  return response.token;
};

// love to singleton
const getSpotifyClient = async (): Promise<SpotifyWebApi> => {
  if (!spotifyClient) {
    const code = await getSpotifyUserToken();
    spotifyClient = new SpotifyWebApi({ clientId: process.env.SPOTIFY_ID, clientSecret: process.env.SPOTIFY_SECRET });
    try {
      const authorize = await spotifyClient.authorizationCodeGrant(code);
      console.log(`The token expires in ${authorize.body.expires_in}`);
      console.log(`The access token is ${authorize.body.access_token}`);
      console.log(`The refresh token is ${authorize.body.refresh_token}`);

      // Set the access token on the API object to use it in later calls
      spotifyClient.setAccessToken(authorize.body.access_token);
      spotifyClient.setRefreshToken(authorize.body.refresh_token);
    } catch (error) {
      console.log('Something went wrong!', error);
    }
  }
  return spotifyClient;
};

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
      resolve: async () => {
        const spotifyApp = getSpotifyClient();
      },
    },
    url: { type: GraphQLString, description: 'My Spotify url', resolve: ({ url }) => url },
  }),
});
