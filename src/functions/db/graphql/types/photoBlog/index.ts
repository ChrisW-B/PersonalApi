import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';
import fetch from 'node-fetch';

import limit from '~/graphql/args/limit';
import photo from '~/graphql/types/photoBlog/photo';

interface PhotoBlogResponse {
  posts: {
    url: string;
    feature_image: string;
    title: string;
    html: string;
    id: string;
  }[];
}

const getPhotos = async (max: number) => {
  const response = await fetch(
    `https://photo.chriswbarry.com/ghost/api/v2/content/posts/?key=${process.env.GHOST_KEY}&limit=${max}&fields=feature_image,url,title,html,id`,
  );

  const data = await (response.json() as Promise<PhotoBlogResponse>);
  return data.posts
    .filter(({ feature_image: img }) => !!img)
    .map(({ feature_image: img = '', ...rest }) => ({
      ...rest,
      photo: img.includes('http') ? img : `https://photo.chriswbarry.com${img}`,
    }));
};

const blog = new GraphQLObjectType({
  name: 'Blog',
  description: 'My blog photos',
  fields: () => ({
    photos: {
      args: { limit },
      type: new GraphQLList(photo),
      description: 'All of the avalible photos',
      resolve: async (_, { limit: max = 5 }) => getPhotos(max as number),
    },
    url: {
      type: GraphQLString,
      description: "My Photo Blog's URL",
      resolve: ({ url }: { url: string }) => url,
    },
  }),
});

export default blog;
