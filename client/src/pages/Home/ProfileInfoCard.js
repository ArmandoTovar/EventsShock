// -----------IMPORTS-----------------------------------------------------------
// @mui
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { Box, Typography } from '@mui/material';
// ----------------------------------------------------------------------

function ProfileInfoCard({ info, shadow }) {
  const labels = [];
  const values = [];

  Object.keys(info).forEach((el) => {
    if (el.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
      const newElement = el.replace(
        uppercaseLetter,
        ` ${uppercaseLetter.toLowerCase()}`,
      );

      labels.push(newElement);
    } else {
      labels.push(el);
    }
  });

  Object.values(info).forEach((el) => values.push(el));

  // Render the card info items
  const renderItems = labels.map((label, key) => (
    <Box key={label} display="flex" py={1} pr={2}>
      <Typography variant="button" fontWeight="bold" textTransform="capitalize">
        {label}: &nbsp;
      </Typography>
      <Typography variant="button" fontWeight="regular" color="text">
        &nbsp;{values[key]}
      </Typography>
    </Box>
  ));

  return (
    <Card sx={{ height: '100%', boxShadow: !shadow && 'none' }}>
      <Box p={2}>
        <Box opacity={0.3}>
          <Divider />
        </Box>
        <Box>
          {renderItems}
          <Box display="flex" py={1} pr={2}></Box>
        </Box>
      </Box>
    </Card>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
};

export default ProfileInfoCard;
