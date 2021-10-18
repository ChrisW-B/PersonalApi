import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';
import Twitter from 'twitter';
import twitterText from 'twitter-text';

import { limit } from '../../args';
import { relativeTime } from '../../utils';
import tweet from './tweet';

interface TwitterResponse {
  text: string;
  entities: {
    urls: twitterText.UrlEntity[];
  };
  // eslint-disable-next-line camelcase
  created_at: string;
  // eslint-disable-next-line camelcase
  id_str: string;
}

let twitterClient: Twitter | null;
// for some reason setting twitterClient on its own wasn't working so...
// singleton!
const getTwitterClient = () => {
  if (!twitterClient) {
    twitterClient = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_SECRET,
    });
  }
  return twitterClient;
};

const convertToText = (text: string, urlEntities: twitterText.UrlEntity[]) =>
  twitterText.autoLink(text, { urlEntities });

const getTweets = async (max: number) => {
  const twitter = getTwitterClient();

  const tweets = (await twitter.get('statuses/user_timeline', {
    screen_name: process.env.TWITTER_ID,
    count: 200, // so we get enough without rts and mentions
    exclude_replies: true,
    include_rts: false,
  })) as TwitterResponse[];

  return tweets
    .map(({ text, entities, created_at: time, id_str: id }) => ({
      time,
      message: convertToText(text, entities.urls),
      relTime: relativeTime(new Date(time)),
      url: `https://twitter.com/statuses/${id}`,
    }))
    .slice(0, max);
};

export default new GraphQLObjectType({
  name: 'Twitter',
  description: 'My Twitter Info',
  fields: () => ({
    tweets: {
      args: { limit },
      type: new GraphQLList(tweet),
      description: 'My recent tweets',
      resolve: async (_, { limit: max = 5 }) => getTweets(max as number),
    },
    url: {
      type: GraphQLString,
      description: 'My Twitter url',
      resolve: ({ url }: { url: string }) => url,
    },
  }),
});
