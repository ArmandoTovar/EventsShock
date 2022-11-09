import { gql } from '@apollo/client';

export const fragmentReviews = gql`
  fragment fragmentReviews on Repository {
    reviews(first: $first, after: $after) {
      edges {
        node {
          id
          text
          rating
          createdAt
          user {
            id
            username
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
      }
    }
  }
`;
export const fragmentEvent = gql`
  fragment fragmentEvent on Event {
    id
    name
    startDate
    finishDate
    image
    userId {
      id
    }
  }
`;

export const fragmentUser = gql`
  fragment fragmentUser on User {
    id
    email
    createdAt
    password
    firstName
    lastName
    birthdate
    rol
    image
    state
  }
`;
