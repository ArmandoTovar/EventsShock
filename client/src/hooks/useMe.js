import { useQuery } from '@apollo/client';
import { ME_USER } from '../graphql/queries';

export const useMe = () => {
  const { data, loading, ...result } = useQuery(ME_USER);

  return {
    me: data ? data.me : null,
    loading,
    ...result,
  };
};
