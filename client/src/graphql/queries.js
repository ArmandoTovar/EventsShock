import { gql } from '@apollo/client';
import { fragmentEvent, fragmentUser } from './fragments';

export const ALL_EVENTS = gql`
  ${fragmentEvent}
  query Events(
    $after: String
    $first: Int
    $orderBy: AlleventsOrderBy
    $orderDirection: OrderDirection
    $searchKeyword: String
    $name: String
  ) {
    events(
      after: $after
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      searchKeyword: $searchKeyword
      name: $name
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ...fragmentEvent
        }
      }
    }
  }
`;

export const ALL_USERS = gql`
  ${fragmentUser}
  query Users($after: String, $first: Int) {
    users(after: $after, first: $first) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        cursor
        node {
          ...fragmentUser
        }
      }
    }
  }
`;

export const ME_USER = gql`
  ${fragmentEvent}
  query Me {
    me {
      id
      email
      createdAt
      password
      firstName
      lastName
      birthdate
      state
      rol
      image
      events {
        ...fragmentEvent
      }
    }
  }
`;

// export const ONE_REPOSITORY = gql`
//   ${fragmentRepository}
//   ${fragmentReviews}
//   query Reviews($repositoryId: ID!, $first: Int, $after: String) {
//     repository(id: $repositoryId) {
//       ...fragmentRepository
//       ...fragmentReviews
//     }
//   }
// `;

export const USER_LOGIN = gql`
  query Query($includeReviews: Boolean = false) {
    me {
      id
      username
      reviews @include(if: $includeReviews) {
        edges {
          node {
            id
            text
            rating
            createdAt
            repositoryId
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`;
