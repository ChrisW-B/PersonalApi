import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';
import fetch from 'node-fetch';

import { limit } from '../../args';
import photo from './photo';

interface PhotoBlogResponse {
  posts: {
    url: string;
    // eslint-disable-next-line camelcase
    feature_image: string;
    title: string;
    html: string;
  }[];
}

const getPhotos = async (max: number) => {
  const response = await fetch(
    `https://photo.chriswbarry.com/ghost/api/v2/content/posts/?key=${process.env.GHOST_KEY}&limit=${max}&fields=feature_image,url,title,html`,
  );

  const data = await (response.json() as Promise<PhotoBlogResponse>);
  return data.posts
    .filter(({ feature_image: img }) => !!img)
    .map(({ url, feature_image: img = '', title, html }) => ({
      title,
      html,
      url,
      photo: img.includes('http') ? img : `https://photo.chriswbarry.com${img}`,
    }));
};

export default new GraphQLObjectType({
  name: 'Blog',
  description: 'My blog photos',
  fields: () => ({
    photos: {
      args: { limit },
      type: new GraphQLList(photo),
      description: 'All of the avalible photos',
      resolve: async (_, { limit: max = 5 }) => getPhotos(max),
    },
    url: {
      type: GraphQLString,
      description: "My Photo Blog's URL",
      resolve: ({ url }: { url: string }) => url,
    },
  }),
});
