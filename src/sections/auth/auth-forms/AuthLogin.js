import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material-ui
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  CircularProgress,
  useMediaQuery
} from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { Eye, EyeSlash } from 'iconsax-react';

// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = ({ forgot }) => {
  const [checked, setChecked] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const xsValue = isMobile ? 11 : 6;
  const { isLoggedIn, login } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            await login(values.email, values.password);
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3} >
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error style={{ textAlign: 'center', fontSize: '15px' }}>Email or Password is inncorect, Please try again!</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <Stack direction="column" textAlign="center" spacing={2
                }>
                  <Stack>
                    <AnimateButton>
                      <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                        {isSubmitting ? <CircularProgress size={24} color="secondary" /> : 'Sign in'}
                      </Button>
                    </AnimateButton>
                  </Stack>
                  {/* <Stack>
                    <AnimateButton>
                      <Button variant='outlined' fullWidth onClick={() => navigate('/health')}>
                        Continue To Smart City Management
                      </Button>
                    </AnimateButton>
                  </Stack> */}
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Stack>
                      <Typography
                        variant="body1"
                        sx={{ textDecoration: 'none' }}
                        color="#4B4B4B"
                        fontSize="14px"
                        fontWeight={500}
                      >
                        Don&apos;t have an account?
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography
                        component={RouterLink}
                        to="/register"
                        variant="body1"
                        sx={{ textDecoration: 'none' }}
                        color="primary"
                        fontSize="14px"
                        fontWeight={500}
                      >
                        Create a new account
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik >
    </>
  );
};

AuthLogin.propTypes = {
  forgot: PropTypes.string
};

export default AuthLogin;
