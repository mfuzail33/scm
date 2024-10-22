import PropTypes from 'prop-types';

// material-ui
import { Box, Grid, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { useNavigate } from 'react-router';
// ==============================|| CHART WIDGET - ECOMMERCE CARD  ||============================== //

const EcommerceDataCard = ({ title, count, color, iconPrimary, children, path }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <MainCard>
      <Grid container spacing={2} onClick={handleNavigate} style={{ cursor: 'pointer' }}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar variant="rounded" color={color}>
                {iconPrimary}
              </Avatar>
              <Typography variant="subtitle1">{title}</Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={7}>
                  {children}
                </Grid>
                <Grid item xs={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Stack spacing={1}>
                    <Typography variant="h4">{count}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

EcommerceDataCard.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.object,
  children: PropTypes.node,
  iconPrimary: PropTypes.node
};

export default EcommerceDataCard;
