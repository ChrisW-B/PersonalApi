import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';
import fetch from 'node-fetch';

import { limit } from '../../args';
import { getFirstN, relativeTime } from '../../utils';
import commitType from './commit';
import { GithubHistoryNode, GithubRepoRefNode, GithubResponse } from './dataModel';

// best way I know of to get all of the refs
const githubQuery = `
{
  viewer {
    repositories(first:5 orderBy: {field: PUSHED_AT, direction: DESC} affiliations:[OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
      nodes {
        url
        nameWithOwner
        refs(first: 50 refPrefix: "refs/heads/") {
          nodes {
            name
            target {
              ... on Commit {
                history(first: 5) {
                  edges {
                    node {
                      committedDate
                      messageHeadlineHTML
                      messageBodyHTML
                      author {
                        user {
                          login
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

const getGithubInfo = async (): Promise<
  {
    url: string;
    author: string;
    name: string;
    time: string;
    relTime: string;
    message: string;
  }[]
> => {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: githubQuery }),
  });

  const responseJson: GithubResponse = await response.json();

  const simplifiedGithubData = responseJson.data.viewer.repositories.nodes
    .reduce(
      (
        repos: { url: string; nameWithOwner: string; ref: GithubRepoRefNode }[],
        { url, nameWithOwner, refs },
      ) => [...repos, ...refs.nodes.map((reference) => ({ url, nameWithOwner, ref: reference }))],
      [],
    )
    .reduce(
      (
        coms: (GithubHistoryNode & { url: string; nameWithOwner: string; branch: string })[],
        { url, nameWithOwner, ref },
      ) => [
        ...coms,
        ...ref.target.history.edges.map((node) => ({
          url,
          nameWithOwner,
          branch: ref.name,
          ...node.node,
        })),
      ],
      [],
    )
    .map(
      ({
        url,
        nameWithOwner,
        branch,
        committedDate,
        messageBodyHTML,
        messageHeadlineHTML,
        author,
      }) => ({
        url,
        nameWithOwner,
        branch,
        committedDate,
        messageBodyHTML,
        messageHeadlineHTML,
        author: author.user,
      }),
    )
    .filter(({ author }) => author !== null && author.login === process.env.GITHUB_ID)
    .map((commit) => ({ ...commit, author: commit.author.login }))
    .map(
      ({
        url,
        nameWithOwner,
        branch,
        committedDate,
        messageBodyHTML,
        messageHeadlineHTML,
        author,
      }) => ({
        url: `${url}/tree/${branch}`,
        author,
        name: `${nameWithOwner}@${branch}`,
        time: committedDate,
        relTime: relativeTime(new Date(committedDate)),
        message: `${messageHeadlineHTML.replace('…', '')}${messageBodyHTML.replace('…', '')}`,
      }),
    )
    .sort(
      (a: { time: string }, b: { time: string }) =>
        new Date(b.time).valueOf() - new Date(a.time).valueOf(),
    );

  return simplifiedGithubData;
};

export default new GraphQLObjectType({
  name: 'Github',
  description: 'My Github Info',
  fields: () => ({
    commits: {
      args: { limit },
      type: new GraphQLList(commitType),
      description: "The Company's Name",
      resolve: async (_, { limit: max = 5 }) => getFirstN(max, await getGithubInfo()),
    },
    url: { type: GraphQLString, description: 'My Github URL', resolve: ({ url }) => url },
  }),
});
