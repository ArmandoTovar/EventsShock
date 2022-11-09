import { useMutation } from '@apollo/client';
import { SIGN_UP } from '../graphql/mutations';
export const useSignUp = () => {
  const [mutate, error, result] = useMutation(SIGN_UP);

  const signUp = async (user) => {
    await mutate({ variables: { user } });
  };
  return [signUp, error, result];
};
