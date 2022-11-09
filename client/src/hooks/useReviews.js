import { useQuery } from '@apollo/client'
import { ONE_REPOSITORY } from '../graphql/queries'

export const useReviews = (variables) => {
  const { loading, data, fetchMore, ...result } = useQuery(ONE_REPOSITORY, {
    variables,
  })
  const FetchMore = () => {
    const canFetchMore =
      !loading && data && data.repository.reviews.pageInfo.hasNextPage

    if (!canFetchMore) {
      return
    }
    fetchMore({
      query: ONE_REPOSITORY,
      variables: {
        after: data.repository.reviews.pageInfo.endCursor,
        ...variables,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const nextResult = {
          repository: {
            ...fetchMoreResult.repository,
            reviews: {
              ...fetchMoreResult.repository.reviews,
              edges: [
                ...previousResult.repository.reviews.edges,
                ...fetchMoreResult.repository.reviews.edges,
              ],
            },
          },
        }

        return nextResult
      },
    })
  }

  return {
    repository: data ? data.repository : undefined,
    FetchMore,
    loading,
    ...result,
  }
}
