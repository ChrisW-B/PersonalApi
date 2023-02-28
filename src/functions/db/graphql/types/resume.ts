// db/graphql/types/Resume.js

import { GraphQLObjectType, GraphQLString } from 'graphql/type';

const resume = new GraphQLObjectType({
  name: 'Resume',
  description: 'Versions of my Resume',
  fields: {
    pdf: { type: GraphQLString, description: 'Resume in pdf format' },
    docx: { type: GraphQLString, description: 'Resume in docx format' },
  },
});
export default resume;
