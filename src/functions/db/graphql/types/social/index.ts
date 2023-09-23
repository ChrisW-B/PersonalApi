import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';
import { createRestAPIClient } from 'masto';
import type { mastodon } from 'masto';

import limit from '~/graphql/args/limit';
import post from '~/graphql/types/social/post';
import relativeTimeDifference from '~/graphql/utils/relativeTimeDifference';

interface SocialResponse {
  message: string | null | undefined;
  url: string | null | undefined;
  time: string;
  reltime: string;
  visibility: string;
}

let socialClient: mastodon.rest.Client | null;
// for some reason setting twitterClient on its own wasn't working so...
// singleton!
const getSocialClient = () => {
  if (!socialClient) {
    socialClient = createRestAPIClient({
      url: process.env.SOCIAL_URL,
      accessToken: process.env.SOCIAL_ACCESS_TOKEN,
    });
  }
  return socialClient;
};

const getPosts = async (max: number): Promise<SocialResponse[]> => {
  const social = getSocialClient();

  const posts = await social.v1.accounts.$select(process.env.SOCIAL_ID).statuses.list({
    excludeReblogs: true,
    excludeReplies: true,
    limit: max,
  });

  return posts
    .filter((status) => status.visibility === 'public' || status.visibility === 'unlisted')
    .map((status) => ({
      message: status.text,
      url: status.url,
      time: status.createdAt,
      reltime: relativeTimeDifference(new Date(status.createdAt)),
      visibility: status.visibility,
    }));
};

const social = new GraphQLObjectType({
  name: 'Social',
  description: 'My Social Info',
  fields: () => ({
    posts: {
      args: { limit },
      type: new GraphQLList(post),
      description: 'My recent posts',
      resolve: async (_, { limit: max = 5 }) => getPosts(max as number),
    },
    url: {
      type: GraphQLString,
      description: 'My Social url',
      resolve: ({ url }: { url: string }) => url,
    },
  }),
});

export default social;
