// db/graphql/types/Photo.js

import { GraphQLObjectType, GraphQLString } from 'graphql/type';

const Photo = new GraphQLObjectType({
  name: `Photo`,
  description: `A Photo from my blog`,
  fields: () => ({
    title: { type: GraphQLString, description: `The Photo Title` },
    html: { type: GraphQLString, description: `The photo html` },
    photo: { type: GraphQLString, description: `The photo source` },
    url: { type: GraphQLString, description: `a link to the post` },
  }),
});

export default Photo;
