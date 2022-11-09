// -----------IMPORTS-----------------------------------------------------------
import React from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import SvgColor from '../../components/svg-color';
import Iconify from '../../components/iconify';
// hooks
import { useMe } from '../../hooks/useMe';
// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

export default function CardEvent({ eveRef, handleOpenEditModal, event }) {
  const { name, startDate, image, userId } = event;
  const latestPostLarge = false;
  const { me } = useMe();

  const latestPost = me.events.find((e) => e.id === event.id);

  const POST_INFO = [
    {
      number: userId.length ?? 0,
      icon: 'carbon:user-avatar-filled',
    },
  ];

  return (
    <Grid
      item
      xs={12}
      sm={latestPostLarge ? 12 : 6}
      md={latestPostLarge ? 6 : 3}
    >
      <div ref={eveRef}></div>
      <Card
        sx={{ position: 'relative' }}
        onClick={() => handleOpenEditModal(event.id)}
      >
        <StyledCardMedia
          sx={{
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          }}
        >
          <SvgColor
            color="paper"
            src="/assets/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
              ...((latestPostLarge || latestPost) && { display: 'none' }),
            }}
          />

          <StyledCover
            alt={name}
            src={image ?? 'assets/images/placeholderImg.svg'}
          />
        </StyledCardMedia>

        <CardContent
          sx={{
            pt: 4,
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: '100%',
              position: 'absolute',
            }),
          }}
        >
          <Typography
            gutterBottom
            variant="caption"
            sx={{ color: 'text.disabled', display: 'block' }}
          >
            {fDate(startDate)}
          </Typography>

          <StyledTitle
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              ...(latestPostLarge && { typography: 'h5', height: 60 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white',
              }),
            }}
          >
            {name}
          </StyledTitle>

          <StyledInfo>
            {POST_INFO.map((info, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: index === 0 ? 0 : 1.5,
                  ...((latestPostLarge || latestPost) && {
                    color: 'grey.500',
                  }),
                }}
              >
                <Iconify
                  icon={info.icon}
                  sx={{ width: 16, height: 16, mr: 0.5 }}
                />
                <Typography variant="caption">{info.number}</Typography>
              </Box>
            ))}
          </StyledInfo>
        </CardContent>
      </Card>
    </Grid>
  );
}
