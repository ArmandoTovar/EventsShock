// -----------IMPORTS-----------------------------------------------------------
import { forwardRef } from 'react';
// dev
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <img src="assets/images/e.svg" alt="logo" />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

export default Logo;
