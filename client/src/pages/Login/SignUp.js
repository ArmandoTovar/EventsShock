// -----------IMPORTS-----------------------------------------------------------
import React, { useState } from 'react';
// @mui
import { Alert, AlertTitle, Box, Fab, Modal } from '@mui/material';

// components
import Button from '../../components/Button';
import Input from '../../components/Input';
import Notification from '../../components/Notification';
// hooks
import useInput from '../../hooks/useInput';
import { useSignUp } from '../../hooks/useSignUp';
// services
import { GetImagenUrl } from '../../services/image';
// ----------------------------------------------------------------------

const SignUp = () => {
  const email = useInput('email');
  const password = useInput('password');
  const firstName = useInput('text');
  const lastName = useInput('lastName');
  const birthdate = useInput('date');
  const [avatar, setAvatar] = useState(null);
  const [signUp] = useSignUp();
  const [button, setButton] = useState(false);
  const [messageError, setMessageError] = useState({ msg: null, error: false });
  const [open, setOpen] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setButton(true);
    try {
      const avatarUrl = await GetImagenUrl(avatar);
      await signUp({
        password: password.value,
        email: email.value,
        firstName: firstName.value,
        birthdate: new Date(birthdate.value),
        lastName: lastName.value,
        image: avatarUrl,
      });
      setOpen(true);
    } catch (e) {
      setMessageError({ msg: e.message, error: true });
      setTimeout(() => {
        setMessageError({ msg: null, error: false });
      }, 3000);
    }
    setButton(false);
  };
  return (
    <div className="containerRegister">
      <form
        onSubmit={handleSubmit}
        className="formRegister"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <h2>Create an account</h2>
        <p>Sunt in culpa qui officia deserunt mollit animid est laborum</p>
        <Input placeholder="First name" {...firstName} />
        <Input placeholder="Family name" {...lastName} />
        <Input placeholder="Birthdate" {...birthdate} />
        <Input placeholder="Email" {...email} />
        <Input placeholder="Password" {...password} />
        <label htmlFor="upload-photo">
          <input
            style={{ display: 'none' }}
            onChange={(e) => setAvatar(e.target.files[0])}
            id="upload-photo"
            name="upload-photo"
            type="file"
          />
          <Fab
            color="warning"
            size="small"
            component="span"
            aria-label="add"
            variant="extended"
          >
            Upload photo
          </Fab>
        </label>
        <p style={{ fontStyle: 'italic' }}>
          Please do not use special characters for you password
        </p>
        <Button disabled={button} style={button ? { background: '#ccc' } : {}}>
          Sign Up
        </Button>
        <Notification message={messageError} />
      </form>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style }}>
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            Your acount has been created <strong>successfully!</strong>
          </Alert>
        </Box>
      </Modal>
    </div>
  );
};
export default SignUp;
// ----------------------------------------------------------------------

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,

  p: 4,
};
