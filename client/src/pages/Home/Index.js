// -----------IMPORTS-----------------------------------------------------------
import React, { useEffect, useState } from 'react';
// @mui
import { Grid, Box, Avatar, Typography, Collapse } from '@mui/material';
// components
import CircularProgress from '../../components/CircularProgress';
import MyEvents from './MyEvents';
import ProfileInfoCard from './ProfileInfoCard';
// hooks
import { useMe } from '../../hooks/useMe';
// utils
import { fDate } from '../../utils/formatTime';
// ----------------------------------------------------------------------

export default function Index() {
  const { loading, me } = useMe();
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);
  if (loading) return <CircularProgress />;

  return (
    <Box mt={5} mb={3}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} xl={4}>
          <Collapse orientation="vertical" in={animate}>
            <Grid container spacing={3} alignItems="center">
              <Grid item> </Grid>
              <Grid item>
                <Avatar
                  src={me.image}
                  alt="profile-image"
                  size="xl"
                  shadow="sm"
                />
              </Grid>
              <Grid item>
                <Box height="100%" mt={0.5} lineHeight={1}>
                  <Typography variant="h5" fontWeight="medium">
                    {me.firstName}
                  </Typography>
                  <Typography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    {me.rol === 1 ? 'admin' : 'user'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Collapse>

          <ProfileInfoCard
            info={{
              fullName: me.firstName + ' ' + me.lastName,
              birthdate: fDate(me.birthdate),
              email: me.email,
              createdAt: new Date(me.createdAt).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            }}
            action={{ route: '', tooltip: 'Edit Profile' }}
            shadow={false}
          />
        </Grid>
        <Grid item xs={12} md={6} xl={8}>
          <MyEvents event={me.events} />
        </Grid>
      </Grid>
    </Box>
  );
}
