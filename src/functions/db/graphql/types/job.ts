// db/graphql/types/Job.js

import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';

import Timespan from '~/graphql/types/timespan';

const job = new GraphQLObjectType({
  name: 'Job',
  description: "A Job I've done",
  fields: () => ({
    company: { type: GraphQLString, description: "The Company's Name" },
    title: { type: GraphQLString, description: 'What My Title Was' },
    when: { type: Timespan, description: 'When I had the job' },
    details: { type: new GraphQLList(GraphQLString), description: 'More About the Job' },
  }),
});

export default job;
