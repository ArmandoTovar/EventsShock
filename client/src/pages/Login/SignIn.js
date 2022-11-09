// -----------IMPORTS-----------------------------------------------------------
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// hooks
import useInput from '../../hooks/useInput';
import { useSignIn } from '../../hooks/useSignIn';
import useAuthStorage from '../../hooks/useAuthStorage';
// components
import Notification from '../../components/Notification';
import Input from '../../components/Input';
import Button from '../../components/Button';
// styles
import styled from 'styled-components';
// ----------------------------------------------------------------------

const SignIn = () => {
  const email = useInput('text');
  const password = useInput('password');
  const [signIn] = useSignIn();
  const navigate = useNavigate();
  const storage = useAuthStorage();
  const [button, setButton] = useState(false);
  const [messageError, setMessageError] = useState({ msg: null, error: false });

  const onSubmit = async (e) => {
    e.preventDefault();
    setButton(true);
    try {
      const data = await signIn({
        email: email.value,
        password: password.value,
      });
      navigate('/');
      storage.setAccessToken(data.data);
      setMessageError(null);
    } catch (e) {
      setMessageError({ msg: e.message, error: true });
      setTimeout(() => {
        setMessageError({ msg: null, error: false });
      }, 3000);
    }
    setButton(false);
  };

  return (
    <ContainerSign>
      <form
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column' }}
        className="formLogin"
      >
        <h2>Login</h2>
        <p>Sunt in culpa qui officia deserunt mollit animid est laborum</p>

        <Input {...email} placeholder="Email" />
        <Input {...password} placeholder="Password" autoComplete="" />
        <Button
          type="submit"
          disabled={button}
          style={button ? { background: '#ccc' } : {}}
        >
          Log in
        </Button>
        <p>Forgot you password</p>
        <Notification message={messageError} />
      </form>
    </ContainerSign>
  );
};
export default SignIn;
// ----------------------------------------------------------------------

const ContainerSign = styled.div`
  margin: 0px;
  padding: 0px;
`;
