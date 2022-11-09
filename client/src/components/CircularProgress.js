// -----------IMPORTS-----------------------------------------------------------
import React from 'react';
// @mui
import { CircularProgress as NativeProgress, Grid } from '@mui/material';

// ----------------------------------------------------------------------

const CircularProgressEdit = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      alignSelf="center"
      justifyContent="center"
      style={{ minHeight: '100vh', alignSelf: 'center' }}
    >
      <Grid item xs={3} style={{ alignSelf: 'center' }}>
        <NativeProgress />
      </Grid>
    </Grid>
  );
};
export default CircularProgressEdit;
