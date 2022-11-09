// -----------IMPORTS-----------------------------------------------------------
import React from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Stack,
  Link,
  Card,
  Button,
  Divider,
  Typography,
  CardHeader,
} from '@mui/material';
// utils
import { fToNow } from '../../utils/formatTime';
// components
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function MyEvents({ event, ...other }) {
  const navigate = useNavigate();
  return (
    <Card {...other}>
      <CardHeader title={'My Events'} subheader={'subscription'} />

      <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
        {event.map((ev) => (
          <NewsItem key={ev.id} event={ev} />
        ))}
      </Stack>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          onClick={() => {
            navigate('/events');
          }}
          size="small"
          color="inherit"
          endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------
function NewsItem({ event }) {
  const { name, finishDate, image, id } = event;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={name}
        src={image ?? 'assets/images/placeholderImg.svg'}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {name}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {id}
        </Typography>
      </Box>

      <Typography
        variant="caption"
        sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}
      >
        {fToNow(finishDate)}
      </Typography>
    </Stack>
  );
}
