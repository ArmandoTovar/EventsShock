// -----------IMPORTS-----------------------------------------------------------
import React from 'react';
// @mui
import { Alert, Grow } from '@mui/material';
// ----------------------------------------------------------------------

const Notification = ({ message }) => {
  return message?.msg === null ? (
    <Alert style={{ visibility: 'hidden' }} severity="error">
      null
    </Alert>
  ) : message.error ? (
    <Grow in={message.msg !== null}>
      <Alert severity="error">{message.msg}</Alert>
    </Grow>
  ) : (
    <Grow in={message.msg !== null}>
      <Alert severity="info">{message.msg}</Alert>
    </Grow>
  );
};

export default Notification;
