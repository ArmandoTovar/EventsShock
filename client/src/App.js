import AuthStorage from './utils/authStorage';
import AuthStorageContext from './context/AuthStorageContext';
import Main from './pages/Main/Index';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import createApolloClient from './utils/apolloClient';
const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthStorageContext.Provider value={authStorage}>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </AuthStorageContext.Provider>
    </ApolloProvider>
  );
}

export default App;
