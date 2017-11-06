// db/graphql/types/Github.js
const fetch = require(`node-fetch`);
const { GraphQLObjectType, GraphQLString, GraphQLList } = require(`graphql/type`);
const commitType = require(`./commit`);
const { limit } = require(`../args`);

const getFirstN = (max = 0, array) => (max ? array.slice(0, max) : array);

const getGithubInfo = async () => {
  const githubRes = await fetch(`https://api.github.com/graphql`, {
    method: `POST`,
    'Content-Type': `application/json`,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    },
    body: JSON.stringify({ query: `{viewer{repositories(first:5 orderBy: {field: PUSHED_AT, direction: DESC} affiliations:[OWNER, COLLABORATOR, ORGANIZATION_MEMBER]){nodes{url nameWithOwner refs(first: 50 refPrefix: "refs/heads/"){nodes{name target{ ... on Commit{history(first: 5){edges{node{author{user{login}} committedDate messageHeadlineHTML messageBodyHTML}}}}}}}}}}}` }) // best way I know of to get all of the refs
  });

  try {
    return (await githubRes.json()).data.viewer.repositories.nodes
      .reduce((repos, { url, nameWithOwner, refs }) => [...repos, ...refs.nodes.map(ref => ({ url, nameWithOwner, ref }))], [])
      .reduce((coms, { url, nameWithOwner, ref }) => [...coms, ...ref.target.history.edges.map(node => (Object.assign({}, { url, nameWithOwner, branch: ref.name }, node.node)))], [])
      .map(({ url, nameWithOwner, branch, committedDate, messageBodyHTML, messageHeadlineHTML, author }) =>
        ({ url, nameWithOwner, branch, committedDate, messageBodyHTML, messageHeadlineHTML, author: author.user }))
      .filter(({ author }) =>
        author !== null && author.login === process.env.GITHUB_ID)
      .map(commit =>
        Object.assign({}, commit, { author: commit.author.login }))
      .map(({ url, nameWithOwner, branch, committedDate, messageBodyHTML, messageHeadlineHTML, author }) =>
        ({ url: `${url}/tree/${branch}`, author, name: `${nameWithOwner}#${branch}`, committedDate, message: `${messageHeadlineHTML.replace(`…`, ``)}${messageBodyHTML.replace(`…`, ``)}` }))
      .sort((a, b) =>
        new Date(b.committedDate) - new Date(a.committedDate));
  } catch (e) {
    throw e;
  }
};

const Github = new GraphQLObjectType({
  name: `Github`,
  description: `My Github Info`,
  fields: () => ({
    commits: {
      args: { limit },
      type: new GraphQLList(commitType),
      description: `The Company's Name`,
      resolve: async (_, { limit: max }) => getFirstN(max, await getGithubInfo())
    },
    url: { type: GraphQLString, description: `My Starting Date`, resolve: url => url }
  })
});

module.exports = Github;