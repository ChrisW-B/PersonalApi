import { GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';

import info from '../../me.json';
import { limit } from '../args';
import { getFirstN } from '../utils';
import { github, job, lastfm, photoBlog, project, resume, skill, twitter } from '.';

export default new GraphQLObjectType({
  name: 'Me',
  description: 'About Me',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'My Name',
      resolve: () => info.name,
    },
    photo: {
      type: GraphQLString,
      description: 'A photo of me',
      resolve: () => info.photo,
    },
    linkedin: {
      type: new GraphQLObjectType({
        name: 'Linkedin',
        description: 'My Linkedin Info',
        fields: {
          url: {
            type: GraphQLString,
            description: 'My LinkedIn URL',
            resolve: ({ url }: { url: string }) => url,
          },
        },
      }),
      description: 'My LinkedIn Info',
      resolve: () => ({ url: info.linkedin }),
    },
    email: {
      type: GraphQLString,
      description: 'My Email Address',
      resolve: () => info.email,
    },
    employed: {
      type: GraphQLBoolean,
      description: 'Do I Have A Job?',
      resolve: () => info.employed,
    },
    bio: {
      type: GraphQLString,
      description: 'A Little About Me',
      resolve: () => info.bio,
    },
    interests: {
      type: GraphQLString,
      description: "What I'm Interested In",
      resolve: () => info.interests,
    },
    resume: {
      type: resume,
      description: 'My Resume',
      resolve: () => info.resume,
    },
    projects: {
      args: { limit },
      type: new GraphQLList(project),
      description: 'Some Recent Projects',
      resolve: (_, { limit: max }) => getFirstN(max as number, info.projects),
    },
    jobs: {
      args: { limit },
      type: new GraphQLList(job),
      description: 'My Recent Jobs',
      resolve: (_, { limit: max }) => getFirstN(max as number, info.jobs),
    },
    skills: {
      type: new GraphQLList(skill),
      description: 'Possible Relevant Skills',
      resolve: () => info.skills,
    },
    twitter: {
      type: twitter,
      description: 'My Twitter Info',
      resolve: () => ({ url: info.twitter }),
    },
    github: {
      type: github,
      description: 'My Github Info',
      resolve: () => ({ url: info.github }),
    },
    lastfm: {
      type: lastfm,
      description: 'My Last.FM info',
      resolve: () => ({ url: info.lastfm }),
    },
    photoBlog: {
      type: photoBlog,
      description: 'My Photo Blog info',
      resolve: () => ({ url: info.blog }),
    },
  }),
});
