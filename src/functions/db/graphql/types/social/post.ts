import { GraphQLObjectType, GraphQLString } from 'graphql/type';

const post = new GraphQLObjectType({
  name: 'Post',
  description: "A Post I've Posted",
  fields: () => ({
    message: { type: GraphQLString, description: 'The Post Text' },
    time: { type: GraphQLString, description: 'When the post was posted' },
    reltime: { type: GraphQLString, description: 'When the post was posted, relatively' },
    url: { type: GraphQLString, description: 'The Post Permalink' },
    visibility: { type: GraphQLString, description: 'The visibility of the post' },
  }),
});

export default post;
