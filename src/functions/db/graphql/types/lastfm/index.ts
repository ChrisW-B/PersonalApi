import crypto from 'crypto';

import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';
import Lastfm from 'lastfm-njs';

import { limit, period } from '../../args';
import chartItem from './chartItem';
import song from './song';

interface LastFMResponse {
  name: string;
  artist: {
    '#text': string;
    name: string;
  };
  image: { size: string; '#text': string }[];
  nowPlaying: boolean;
  '@attr': Record<string, unknown>;
  playcount: number;
}

/* eslint-disable camelcase */
interface LastFMClient {
  user_getRecentTracks(data: { user: string; limit: number }): Promise<{ track: LastFMResponse[] }>;
  user_getTopTracks(data: {
    user: string;
    limit: number;
    period: string;
  }): Promise<{ track: LastFMResponse[] }>;
  user_getTopArtists(data: {
    user: string;
    limit: number;
    period: string;
  }): Promise<{ artist: LastFMResponse[] }>;

  user_getTopAlbums(data: {
    user: string;
    limit: number;
    period: string;
  }): Promise<{ album: LastFMResponse[] }>;
}
/* eslint-enable camelcase */
let lastFmClient: LastFMClient | undefined;

// love to singleton

const getLastFmClient = (): LastFMClient => {
  if (!lastFmClient) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    lastFmClient = new Lastfm({
      apiKey: process.env.LASTFM_KEY,
      apiSecret: process.env.LASTFM_SECRET,
    }) as LastFMClient;
  }

  return lastFmClient;
};

interface LastFMTrack {
  title: string;
  artist: string;
  nowplaying: 'true' | 'false' | boolean;
  image: string;
}

const getLastFmSongs = async (max: number): Promise<LastFMTrack[]> => {
  const lastFm = getLastFmClient();
  const maxSongs = max > 50 ? 50 : max;

  let tracks = (await lastFm.user_getRecentTracks({ user: process.env.LASTFM_ID, limit: maxSongs }))
    .track;
  if (max !== tracks.length) tracks = tracks.slice(0, max); // sometimes last.fm returns 2 tracks when you ask for 1
  return tracks.map((track) => ({
    title: track.name,
    artist: track.artist['#text'],
    nowplaying: false,
    image: track.image.length ? track.image[track.image.length - 1]?.['#text'] : '',
    ...track['@attr'],
    id: crypto
      .createHash('sha1')
      .update(track.name + track.artist['#text'])
      .digest('base64'),
  }));
};

const getTopTracks = async (timePeriod: string, max: number) => {
  const lastFm = getLastFmClient();
  const tracks = (
    await lastFm.user_getTopTracks({
      user: process.env.LASTFM_ID,
      limit: max,
      period: timePeriod,
    })
  ).track;
  return tracks.map(({ name, artist, playcount }) => ({
    name,
    artist: artist.name,
    playcount,
    id: crypto
      .createHash('sha1')
      .update(name + artist.name)
      .digest('base64'),
  }));
};

const getTopArtists = async (timePeriod: string, max: number) => {
  const lastFm = getLastFmClient();

  const artists = (
    await lastFm.user_getTopArtists({
      user: process.env.LASTFM_ID,
      limit: max,
      period: timePeriod,
    })
  ).artist;
  return artists.map(({ name, playcount }) => ({
    artist: name,
    playcount,
    id: crypto.createHash('sha1').update(name).digest('base64'),
  }));
};

const getTopAlbums = async (timePeriod: string, max: number) => {
  const lastFm = getLastFmClient();

  const albums = (
    await lastFm.user_getTopAlbums({
      user: process.env.LASTFM_ID,
      limit: max,
      period: timePeriod,
    })
  ).album;
  return albums.map(({ name, artist, playcount }) => ({
    name,
    artist: artist.name,
    playcount,
    id: crypto
      .createHash('sha1')
      .update(name + artist.name)
      .digest('base64'),
  }));
};

export default new GraphQLObjectType({
  name: 'LastFM',
  description: 'My Github Info',
  fields: () => ({
    mostPlayedTracks: {
      args: { limit, period },
      type: new GraphQLList(chartItem),
      description: 'My most played songs',
      resolve: async (_, { limit: max = 10, period: timePeriod }) => getTopTracks(timePeriod, max),
    },
    mostPlayedArtists: {
      args: { limit, period },
      type: new GraphQLList(chartItem),
      description: 'My most played artists',
      resolve: async (_, { limit: max = 10, period: timePeriod }) => getTopArtists(timePeriod, max),
    },
    mostPlayedAlbums: {
      args: { limit, period },
      type: new GraphQLList(chartItem),
      description: 'My most played albums',
      resolve: async (_, { limit: max = 10, period: timePeriod }) => getTopAlbums(timePeriod, max),
    },
    recentSongs: {
      args: { limit },
      type: new GraphQLList(song),
      description: 'A Song I listened to',
      resolve: async (_, { limit: max = 5 }) => getLastFmSongs(max),
    },
    nowplaying: {
      type: song,
      description: "What's playing right now",
      resolve: async () => {
        const songs = await getLastFmSongs(1);
        const mostRecentSong = songs.length > 0 && songs[0];
        const nowPlaying =
          mostRecentSong &&
          (mostRecentSong.nowplaying === 'true' ||
            (typeof mostRecentSong.nowplaying === 'boolean' && mostRecentSong.nowplaying));

        return nowPlaying
          ? { ...mostRecentSong, nowplaying: true }
          : { ...(mostRecentSong || { title: undefined, artist: undefined }), nowplaying: false };
      },
    },
    url: {
      type: GraphQLString,
      description: 'My Last.FM url',
      resolve: ({ url }: { url: string }) => url,
    },
  }),
});
