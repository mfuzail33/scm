import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Checkbox, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';

// select company-size
const sizes = [
  {
    value: '1',
    label: '1 - 5'
  },
  {
    value: '2',
    label: '5 - 10'
  },
  {
    value: '3',
    label: '10+'
  }
];

// ==============================|| CONTACT US - FORM ||============================== //

function ContactForm() {
  const theme = useTheme();
  const [size, setSize] = useState(1);
  const handleCompanySize = (event) => {
    setSize(Number(event.target?.value));
  };
  return (
    <Box sx={{ p: { xs: 2.5, sm: 0 } }}>
      <Grid container spacing={5} justifyContent="center">
        <Grid item xs={12} sm={10} lg={9}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth type="text" placeholder="First name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth type="text" placeholder="Last name" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="email" placeholder="Email Address" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="number" placeholder="Phone Number" />
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth placeholder="Company Size" value={size} onChange={handleCompanySize}>
                {sizes.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={10} lg={9}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1 }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Stack direction="row" alignItems="center" sx={{ ml: -1 }}>
              <Checkbox sx={{ '& .css-1vjb4cj': { borderRadius: '2px' } }} defaultChecked />
              <Typography>
                I agree to all the{' '}
                <Typography sx={{ cursor: 'pointer' }} component="span" color={theme.palette.primary.main}>
                  Terms & Condition
                </Typography>
              </Typography>
            </Stack>
            <Button variant="contained" sx={{ ml: { xs: 0 } }}>
              Submit
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ContactForm;
