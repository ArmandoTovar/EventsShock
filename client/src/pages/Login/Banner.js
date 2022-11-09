// -----------IMPORTS-----------------------------------------------------------
import React from 'react';
// styles
import styled from 'styled-components';
// ----------------------------------------------------------------------

export default function Banner() {
  return (
    <ContainerBanner>
      <Shock>
        <ImgShock src="assets/images/e.svg" alt="Logo ShockLogic" />
      </Shock>
      <Separator />
      <ShockDescription>
        <P>
          <Span> Bonorum et Malorum</Span>
        </P>
        <P>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed
        </P>
      </ShockDescription>
      <ContainerSponsored>
        <SponsoredTitle>Sponsored by</SponsoredTitle>
        <Img src="assets/images/a.svg" alt="cop1" />

        <Img src="assets/images/b.svg" alt="cop2" />

        <Img src="assets/images/c.svg" alt="cop3" />

        <Img src="assets/images/d.svg" alt="cop4" />
      </ContainerSponsored>
      <Separator />
      <Contact>
        <P>
          <Span>Contact:</Span>
        </P>
        <P>+44 (0)20 7869 6893</P>
        <P>contact@shocklogin.com</P>
      </Contact>
    </ContainerBanner>
  );
}

// ----------------------------------------------------------------------
const SponsoredTitle = styled.h4`
  display: block;
  width: 100%;
  text-align: center;
  font: normal normal normal 16px/21px Segoe UI;
  letter-spacing: 0px;
  color: #1b225e;
  opacity: 1;
  font-weight: 500;
`;
const ContainerSponsored = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  boxshadow: 5px 5px 15px #00000026;
  border-radius: 20px;
  opacity: 1;
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;
const Separator = styled.hr`
  width: 70%;
  border: 1px solid #ffffff;
  opacity: 0.25;
  margin: 20px 0px;
`;
const ContainerBanner = styled.div`
  background-image: url('assets/images/background.png');
  background-repeat: no-repeat;
  background-size: auto;
  background-attachment: fixed;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0px;
  height: 100%;
  @media (max-width: 768px) {
    width: 100%;
    order: 2;
  }
`;
const Shock = styled.div`
  display: flex;
  justify-content: center;
  width: 90%;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 2px solid #ff6e0b;
  border-radius: 10px;
  opacity: 1;
`;
const ShockDescription = styled.div`
  width: 80%;
  flex-grow: 1;
`;
const ImgShock = styled.img`
  margin: 20px;
  height: 80px;
`;
const Contact = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 80%;
  margin-bottom: 20px;
`;
const P = styled.p`
  color: white;
  text-align: left;
  margin: 4px;
  line-height: 25px;
`;
const Span = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
`;
const Img = styled.img`
  height: 50px;
  margin: 0px 5px 20px 5px;
`;
