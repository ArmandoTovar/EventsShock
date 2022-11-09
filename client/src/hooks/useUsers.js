import { useQuery } from '@apollo/client';
import { ALL_USERS } from '../graphql/queries';

export const useUsers = (variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(ALL_USERS, {
    variables,
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data && data.users.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }
    fetchMore({
      query: ALL_USERS,
      variables: {
        after: data.users.pageInfo.endCursor,
        ...variables,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const nextResult = {
          users: {
            ...fetchMoreResult.users,
            edges: [
              ...previousResult.users.edges,
              ...fetchMoreResult.users.edges,
            ],
          },
        };

        return nextResult;
      },
    });
  };

  return {
    users: data ? data.users : undefined,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  };
};
