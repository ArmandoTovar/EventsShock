// -----------IMPORTS-----------------------------------------------------------
import React from 'react';
// styles
import styled from 'styled-components';
// ----------------------------------------------------------------------

export default function Button({
  children,
  style,
  onClick,
  border = false,
  ...props
}) {
  return (
    <ButtonStyle onClick={onClick} style={{ ...style }} {...props}>
      {children}
    </ButtonStyle>
  );
}

const ButtonStyle = styled.button`
  background: #ff6e0b 0% 0% no-repeat padding-box;
  border-radius: 5px;
  border-width: 0px;
  opacity: 1;
  color: #fff;
  font-weight: bold;
  padding: 20px;
  font-size: 1rem;
`;
