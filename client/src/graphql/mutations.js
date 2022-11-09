import { gql } from '@apollo/client';
import { fragmentEvent } from './fragments';

export const LOGIN = gql`
  mutation Mutation($credentials: AuthenticateInput) {
    authenticate(credentials: $credentials) {
      accessToken
    }
  }
`;
export const SIGN_UP = gql`
  mutation Mutation($user: CreateUserInput) {
    createUser(user: $user) {
      createdAt
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation Mutation($event: CreateEventInput) {
    createEvent(Event: $event) {
      createdAt
    }
  }
`;
export const EVENT_SUBSCRIPTION = gql`
  ${fragmentEvent}
  mutation EditUser($editUserId: ID!, $user: EditUserInput) {
    editUser(id: $editUserId, user: $user) {
      events {
        ...fragmentEvent
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId)
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($editUserId: ID!, $user: EditUserInput) {
    editUser(id: $editUserId, user: $user) {
      id
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($deleteEventId: ID!) {
    deleteEvent(id: $deleteEventId)
  }
`;

export const EDIT_EVENT = gql`
  mutation EditEvent($editEventId: ID!, $event: EditEventInput) {
    editEvent(id: $editEventId, event: $event) {
      id
    }
  }
`;
