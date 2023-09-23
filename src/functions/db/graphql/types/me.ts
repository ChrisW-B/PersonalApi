import { GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';

import info from '~/../db/me.json';
import limit from '~/graphql/args/limit';
import job from '~/graphql/types/job';
import lastFM from '~/graphql/types/lastfm';
import photoBlog from '~/graphql/types/photoBlog';
import project from '~/graphql/types/project';
import resume from '~/graphql/types/resume';
import skills from '~/graphql/types/skill';
import social from '~/graphql/types/social';
import getFirstN from '~/graphql/utils/getFirstN';

const me = new GraphQLObjectType({
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
      resolve: (_, { limit: max }) => getFirstN(info.projects, max as number),
    },
    jobs: {
      args: { limit },
      type: new GraphQLList(job),
      description: 'My Recent Jobs',
      resolve: (_, { limit: max }) => getFirstN(info.jobs, max as number),
    },
    skills: {
      type: new GraphQLList(skills),
      description: 'Possible Relevant Skills',
      resolve: () => info.skills,
    },
    github: {
      type: new GraphQLObjectType({
        name: 'GitHub',
        description: 'My GitHub Info',
        fields: {
          url: {
            type: GraphQLString,
            description: 'My GitHub URL',
            resolve: ({ url }: { url: string }) => url,
          },
        },
      }),
      deprecationReason: "I don't use github much anymore. Try the `git` field instead.",
      description: 'My GitHub Info',
      resolve: () => ({ url: info.github }),
    },
    git: {
      type: new GraphQLObjectType({
        name: 'Git',
        description: 'My Git Info',
        fields: {
          url: {
            type: GraphQLString,
            description: 'My Git URL',
            resolve: ({ url }: { url: string }) => url,
          },
        },
      }),
      description: 'My Git Info',
      resolve: () => ({ url: info.git }),
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
    twitter: {
      type: new GraphQLObjectType({
        name: 'Twitter',
        description: 'My Twitter Info',
        fields: {
          url: {
            type: GraphQLString,
            description: 'My Twitter URL',
            resolve: ({ url }: { url: string }) => url,
          },
        },
      }),
      deprecationReason: "I don't use twitter much anymore. Try the `social` field instead.",
      description: 'My Twitter Info',
      resolve: () => ({ url: info.twitter }),
    },
    social: {
      type: social,
      description: 'My public social account',
      resolve: () => ({ url: info.social }),
    },
    lastfm: {
      type: lastFM,
      description: 'My Last.FM info',
      resolve: () => ({ url: info.lastfm }),
    },
    photoBlog: {
      type: photoBlog,
      description: 'My Photo Blog info',
      resolve: () => ({ url: info.photoblog }),
    },
  }),
});

export default me;
