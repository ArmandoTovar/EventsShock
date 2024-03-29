import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { APOLLO_URI } from './config';
const httpLink = new HttpLink({
  uri: APOLLO_URI,
});
const createApolloClient = (authStorage) => {
  const authLink = setContext(async (_, { headers }) => {
    try {
      const accessToken = await authStorage.getAccessToken();
      return {
        headers: {
          ...headers,

          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    } catch (e) {
      return {
        headers,
      };
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
export default createApolloClient;
