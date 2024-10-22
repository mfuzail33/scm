import { Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import Logo from 'components/logo';
// import LogoMain from 'components/logo/LogoMain';
import useAuth from 'hooks/useAuth';
import AuthDivider from 'sections/auth/AuthDivider';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';
import MainCard from 'components/MainCard';

const Login = () => {
  return (
    <AuthWrapper>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          {/* <LogoMain /> */}
        </Grid>
        <Grid item xs={12}>
          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: { xs: -0.5, sm: 0.5 } }}
          >
            <Typography fontSize="30px" fontWeight={600}>
              Welcome Back
            </Typography>
            <Typography fontSize="15px" fontWeight={500}>
              Sign in to continue
            </Typography>
          </Stack>
        </Grid>
        <Grid mt={4} xs={12}>
          <AuthLogin forgot="/auth/forgot-password" />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Login;
