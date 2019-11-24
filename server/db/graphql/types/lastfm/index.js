import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';
import Lastfm from 'lastfm-njs';

import { limit, period } from '../../args';
import chartItem from './chartItem';
import song from './song';

let lastFmClient = null;

// love to singleton
const getLastFmClient = () => {
  if (lastFmClient === null) {
    lastFmClient = new Lastfm({
      apiKey: process.env.LASTFM_KEY,
      apiSecret: process.env.LASTFM_SECRET,
    });
  }
  return lastFmClient;
};

const getLastFmSongs = async max => {
  const lastFm = getLastFmClient();
  const maxSongs = max > 50 ? 50 : max;

  let tracks = (
    await lastFm.user_getRecentTracks({
      user: process.env.LASTFM_ID,
      limit: maxSongs,
    })
  ).track;
  if (max !== tracks.length) tracks = tracks.slice(0, max); // sometimes last.fm returns 2 tracks when you ask for 1
  return tracks.map(track =>
    Object.assign({}, { title: track.name, artist: track.artist['#text'], nowplaying: false }, track['@attr']),
  );
};

const getTopTracks = async (timePeriod, max) => {
  const lastFm = getLastFmClient();
  const tracks = (
    await lastFm.user_getTopTracks({
      user: process.env.LASTFM_ID,
      limit: max,
      period: timePeriod,
    })
  ).track;
  return tracks.map(({ name, artist, playcount }) => ({ name, artist: artist.name, playcount }));
};

const getTopArtists = async (timePeriod, max) => {
  const lastFm = getLastFmClient();

  const artists = (
    await lastFm.user_getTopArtists({
      user: process.env.LASTFM_ID,
      limit: max,
      period: timePeriod,
    })
  ).artist;
  return artists.map(({ name, playcount }) => ({ artist: name, playcount }));
};

const getTopAlbums = async (timePeriod, max) => {
  const lastFm = getLastFmClient();

  const albums = (
    await lastFm.user_getTopAlbums({
      user: process.env.LASTFM_ID,
      limit: max,
      period: timePeriod,
    })
  ).album;
  return albums.map(({ name, artist, playcount }) => ({ name, artist: artist.name, playcount }));
};

const LastFMType = new GraphQLObjectType({
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
        const mostRecentSong = songs && songs.length > 0 && songs[0];
        const nowPlaying =
          mostRecentSong &&
          (mostRecentSong.nowplaying === 'true' ||
            (typeof mostRecentSong.nowplaying == 'boolean' && mostRecentSong.nowplaying));

        return nowPlaying
          ? { ...mostRecentSong, nowplaying: true }
          : { ...(mostRecentSong ? mostRecentSong : { title: null, artist: null }), nowplaying: false };
      },
    },
    url: { type: GraphQLString, description: 'My Last.FM url', resolve: ({ url }) => url },
  }),
});

export default LastFMType;
