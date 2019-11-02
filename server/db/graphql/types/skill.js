// db/graphql/types/Skills.js

import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';

const Skills = new GraphQLObjectType({
  name: `Skills`,
  description: `Some Relevant Skills`,
  fields: () => ({
    category: { type: GraphQLString, description: `The skill category` },
    types: { type: new GraphQLList(GraphQLString), description: `The skills` },
  }),
});

export default Skills;
