// -----------IMPORTS-----------------------------------------------------------
import React from 'react';
// components
import Banner from './Banner';
import BannerExplorer from './BannerExplorer';
import SingIn from './SignIn';
import SingUp from './SignUp';
import CircularProgress from '../../components/CircularProgress';
// styles
import styled from 'styled-components';
// hooks
import { useMe } from '../../hooks/useMe';
// dep
import { Navigate } from 'react-router';

// ----------------------------------------------------------------------

const Index = () => {
  const { loading, me } = useMe();

  if (loading) return <CircularProgress />;

  if (me !== null) return <Navigate to="/home" replace />;
  return (
    <Container>
      <Banner />

      <BannerExplorer>
        <SingUp />
        <SingIn />
      </BannerExplorer>
    </Container>
  );
};
export default Index;
// ----------------------------------------------------------------------

const Container = styled.div`
  display: flex;
  justify-content: stretch;
  gap: 10px;
  height: 95.9vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
