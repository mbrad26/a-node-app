import 'dotenv/config';
import 'cross-fetch/polyfill';
import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
  },
});

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query($organization: String!) {
    organization(login: $organization) {
      name
      url
      repositories(first: 5, orderBy: { field: STARGAZERS, direction: DESC }) {
        edges {
          node {
            id
            name
            url
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const ADD_STAR = gql`
  mutation AddStar($repositoryId: ID!) {
    addStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

client.query({
  query: GET_REPOSITORIES_OF_ORGANIZATION,
  variables: { organization: "the-road-to-learn-react" },
}).then(console.log);

client.mutate({
  mutation: ADD_STAR,
  variables: {
    repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
  },
}).then(console.log);
