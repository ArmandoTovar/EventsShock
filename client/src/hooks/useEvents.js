import { useApolloClient, useQuery } from '@apollo/client';
import {
  CREATE_EVENT,
  DELETE_EVENT,
  EDIT_EVENT,
  EVENT_SUBSCRIPTION,
} from '../graphql/mutations';
import { ALL_EVENTS, ME_USER } from '../graphql/queries';

export const useEvents = (variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(ALL_EVENTS, {
    variables,
    // ...
  });
  const apolloClient = useApolloClient();
  const handleFetchMore = () => {
    const canFetchMore = !loading && data && data.events.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }
    fetchMore({
      query: ALL_EVENTS,
      variables: {
        after: data.events.pageInfo.endCursor,
        ...variables,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const nextResult = {
          events: {
            ...fetchMoreResult.events,
            edges: [
              ...previousResult.events.edges,
              ...fetchMoreResult.events.edges,
            ],
          },
        };

        return nextResult;
      },
    });
  };

  const editEvent = async ({
    newEditevent,
    editEventId,
    setOpenEdit,
    setOpenModal,
    setEventId,
    setMessageError,
  }) => {
    try {
      const operation = await apolloClient.mutate({
        mutation: EDIT_EVENT,
        variables: {
          event: newEditevent,
          editEventId,
        },
        refetchQueries: [{ query: ALL_EVENTS }, 'Events'],
      });
      if (operation) {
        setOpenEdit(false);
        setOpenModal(true);
        setEventId(undefined);
      }
    } catch (e) {
      setMessageError({ msg: e.message, error: true });
      setTimeout(() => {
        setMessageError({ msg: null, error: false });
      }, 3000);
    }
  };

  const subsEvent = async ({
    me,
    id,
    setOpenEdit,
    setEventId,
    setMessageError,
  }) => {
    let events = me.events.map((e) => e.id);
    if (me.events.find((e) => e.id === id)) {
      events = events.filter((e) => e !== id);
    } else {
      events = [...events, id];
    }
    if (events !== []) {
      try {
        await apolloClient.mutate({
          mutation: EVENT_SUBSCRIPTION,
          variables: {
            editUserId: me.id,
            user: {
              events,
            },
          },
          refetchQueries: [{ query: ME_USER }, 'Me'],
        });
        setEventId(undefined);
        setOpenEdit(false);
      } catch (e) {
        setMessageError({ msg: e.message, error: true });
        setTimeout(() => {
          setMessageError({ msg: null, error: false });
        }, 3000);
      }
    }
  };
  const createEvent = async ({
    newEditevent,
    setOpenEdit,
    setOpenModal,
    setEventId,
    setMessageError,
  }) => {
    try {
      await apolloClient.mutate({
        mutation: CREATE_EVENT,
        variables: {
          event: newEditevent,
        },
        refetchQueries: [{ query: ALL_EVENTS }, 'Events'],
      });
      setOpenEdit(false);
      setOpenModal(true);
      setEventId(undefined);
    } catch (e) {
      setMessageError({ msg: e.message, error: true });
      setTimeout(() => {
        setMessageError({ msg: null, error: false });
      }, 3000);
    }
  };

  const deleteEvent = async ({
    id,
    setOpenEdit,
    setOpenModal,
    setEventId,
    setMessageError,
  }) => {
    const deleteEventId = id;

    try {
      const operation = await apolloClient.mutate({
        mutation: DELETE_EVENT,
        variables: {
          deleteEventId,
        },
        refetchQueries: [{ query: ALL_EVENTS }, 'Events'],
      });
      if (operation) {
        setOpenEdit(false);
        setOpenModal(true);
        setEventId(undefined);
      }
    } catch (e) {
      setMessageError({ msg: e.message, error: true });
      setTimeout(() => {
        setMessageError({ msg: null, error: false });
      }, 3000);
    }
  };
  return {
    events: data ? data.events : undefined,
    fetchMore: handleFetchMore,
    hasMore: data ? data.events.pageInfo.hasNextPage : undefined,
    loading,
    editEvent,
    subsEvent,
    createEvent,
    deleteEvent,
    ...result,
  };
};
