// -----------IMPORTS-----------------------------------------------------------
import React from 'react';
// styles
import styled from 'styled-components';
// ----------------------------------------------------------------------

export default function BannerExplorer({ children }) {
  return (
    <ContainerExplorer>
      <BannerConteiner>
        <Banner>
          <p>We suggest that you use one of these browsers:</p>
          <Img src="assets/images/chrome.svg" alt="chrome" />

          <Img src="assets/images/mozilla.svg" alt="mozilla" />
        </Banner>
      </BannerConteiner>
      {children}
    </ContainerExplorer>
  );
}
// ----------------------------------------------------------------------

const ContainerExplorer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-grow: 1;
  gap: 50px;
  align-content: start;
`;
const BannerConteiner = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const Banner = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: -3px -3px 5px #0000000d;
  border: 1px solid #ff6e0b;
  border-radius: 10px;
  opacity: 1;
  display: flex;
  padding: 10px 20px;
  margin-top: 5%;
  & > p {
    text-align: center;
    margin: 5px;
  }
  max-height: 50px;
  justify-content: center;
`;

const Img = styled.img`
  height: 45px;
  margin-left: 10px;
`;
