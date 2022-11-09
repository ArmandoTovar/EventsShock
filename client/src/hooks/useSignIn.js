import { useApolloClient, useMutation } from '@apollo/client';
import { LOGIN } from '../graphql/mutations';
import useAuthStorage from './useAuthStorage';
export const useSignIn = () => {
  const [mutate, error, result] = useMutation(LOGIN);

  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const signIn = async ({ email, password }) => {
    const credentials = { email, password };
    const { data } = await mutate({ variables: { credentials } });
    await authStorage.setAccessToken(data.authenticate.accessToken);
    apolloClient.resetStore();
  };
  return [signIn, error, result];
};
