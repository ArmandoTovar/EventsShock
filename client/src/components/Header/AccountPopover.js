// -----------IMPORTS-----------------------------------------------------------
import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Divider,
  Typography,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
} from '@mui/material';
//dep
import { useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router';
//component
import CircularProgress from '../CircularProgress';
//hooks
import { useMe } from '../../hooks/useMe';
import useAuthStorage from '../../hooks/useAuthStorage';
// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const { loading, me } = useMe();
  const storage = useAuthStorage();
  const navigate = useNavigate();
  const apoloClient = useApolloClient();
  if (loading) return <CircularProgress />;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const logout = async () => {
    storage.removeAccessToken();
    try {
      await apoloClient.resetStore();
      navigate('/login');
    } catch (e) {}
  };
  const handleClose = async () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={me.image} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {me.firstName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {me.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
