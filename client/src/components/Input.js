import React from 'react';
import styled from 'styled-components';

export default function Input({
  style,
  placeholder = 'd',
  border = false,
  ...props
}) {
  return (
    <InputStyle htmlFor={'inp' + placeholder.replace(' ', '_')}>
      <InputStyleInput
        type="text"
        id={'inp' + placeholder.replace(' ', '_')}
        placeholder="&nbsp;"
        style={{ ...style }}
        {...props}
      ></InputStyleInput>
      <InputStyleLabel className="label">{placeholder}</InputStyleLabel>
      <InputStyleFocus className="focus-bg"></InputStyleFocus>
    </InputStyle>
  );
}

const InputStyleInput = styled.input`
  border-radius: 10px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 95%;
  border: 0;
  font-family: inherit;
  padding: 16px 12px 0 12px;
  height: 56px;
  font-size: 16px;
  font-weight: 400;
  background: rgba(0, 0, 0, 0.02);

  color: #000;
  transition: all 0.15s ease;
  &:hover {
    background: rgba(0, 0, 0, 0.04);
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.5);
  }
  &:not(:-moz-placeholder-shown) + .label {
    color: rgba(0, 0, 0, 0.5);
    transform: translate3d(0, -12px, 0) scale(0.75);
  }
  &:not(:-ms-input-placeholder) + .label {
    color: rgba(0, 0, 0, 0.5);
    transform: translate3d(0, -12px, 0) scale(0.75);
  }
  &:not(:placeholder-shown) + .label {
    color: rgba(0, 0, 0, 0.5);
    transform: translate3d(0, -12px, 0) scale(0.75);
  }
  &:focus {
    background: rgba(0, 0, 0, 0.05);
    outline: none;
    box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.4);
  }
  &:focus + .label {
    color: rgba(0, 0, 0, 0.4);
    transform: translate3d(0, -12px, 0) scale(0.75);
  }
  &:focus + .label {
    color: rgba(0, 0, 0, 0.4);
    transform: translate3d(0, -12px, 0) scale(0.75);
  }
  &:focus + .label + .focus-bg {
    transform: scaleX(1);
    transition: all 0.1s ease;
  }
`;
const InputStyleFocus = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  z-index: -1;
  transform: scaleX(0);
  transform-origin: left;
`;
const InputStyleLabel = styled.span`
  position: absolute;
  top: 20px;
  left: 12px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.4);
  font-weight: 500;
  transform-origin: 0 0;
  transform: translate3d(0, 0, 0);
  transition: all 0.2s ease;
  pointer-events: none;
`;
const InputStyle = styled.label`
  position: relative;
  margin: 10px 0px;
  width: 100%;
  border-radius: 3px;
  overflow: hidden;
`;
