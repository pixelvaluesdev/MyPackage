import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { login } from '../../api/auth.api';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import loginImage from 'assets/images/login_bg.png';
import loginLogo from 'assets/images/mypackage_logos.png';
import loginSqr from 'assets/images/login_sqr.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// third party
import { useForm } from 'react-hook-form';

// project imports
import { emailSchema, passwordSchema } from 'utils/validationSchema';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ==============================|| AUTH - LOGIN ||============================== //

export default function AuthLogin({ inputSx }) {
  
  const [openTerms, setOpenTerms] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await login(data); // { email, password }

      // save token
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.data.id);
      localStorage.setItem('user_name', res.data.data.name);
      localStorage.setItem('user_role', res.data.data.role);
      const updatedProfile = res.data.data;
      localStorage.setItem("user", JSON.stringify(updatedProfile));
      // redirect
      if(localStorage.getItem("user_role") === 'manager'){
        navigate('/visualize');
      }else{
        navigate('/dashboard');
      }

    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Login failed",
        severity: "error"
      });
      //alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: '100vh',
        width: '100%'
      }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%',color: 'white' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* LEFT IMAGE SECTION */}
      <Grid
        size={{ xs: 0, sm: 5, md: 5 }}
        sx={{
          display: {
            xs: 'none',
            sm: 'block'
          }
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100vh',
            background: `url(${loginImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative'
          }}
        >
          {/* LOGO */}
          <Box
            sx={{
              position: 'absolute',
              top: 30,
              left: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box
              component="img"
              src={loginSqr}
              alt="square"
              sx={{
                width: 24
              }}
            />

            <Box
              component="img"
              src={loginLogo}
              alt="logo"
              sx={{
                width: 140
              }}
            />
          </Box>
        </Box>
      </Grid>

      {/* RIGHT FORM SECTION */}
      <Grid
        size={{ xs: 12, sm: 7, md: 7 }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          px: {
            xs: 3,
            sm: 5,
            md: 8
          },
          py: 5
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 500,
          }}
        >
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 5,
              width: '100%',
              backgroundColor: '#000',
              padding: '10px 0'
            }}
          >
          {/* Square Logo */}
          <Box
            component="img"
            src={loginSqr}
            alt="square-logo"
            sx={{
              width: 22,
              height: 'auto'
            }}
          />

          {/* Main Logo */}
          <Box
              component="img"
              src={loginLogo}
              alt="logo"
              sx={{
                width: 120,
                height: 'auto'
              }}
            />
          </Box>
          <Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
          Sign In
          </Typography>

          <Typography variant="body1" sx={{ opacity: 0.9 }} mb={4}>
            Please enter your details to continue
          </Typography>
        </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                {/* EMAIL */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    mb={1}
                    fontWeight={500}
                  >
                    Username
                  </Typography>

                  <TextField
                    fullWidth
                    label="Email Address / Username"
                    placeholder="example@materially.com"
                    {...register('email', emailSchema)}
                    error={Boolean(errors.email)}
                    sx={inputSx}
                  />

                  {errors.email?.message && (
                    <FormHelperText error>
                      {errors.email.message}
                    </FormHelperText>
                  )}
                </Box>

                {/* PASSWORD */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    mb={1}
                    fontWeight={500}
                  >
                    Password
                  </Typography>

                  <FormControl
                    fullWidth
                    error={Boolean(errors.password)}
                  >
                    <InputLabel>Password</InputLabel>

                    <OutlinedInput
                      {...register('password', passwordSchema)}
                      type={isPasswordVisible ? 'text' : 'password'}
                      label="Password"
                      placeholder="Enter your password"
                      endAdornment={
                        <InputAdornment position="end">
                          <Box
                            onClick={() =>
                              setIsPasswordVisible(!isPasswordVisible)
                            }
                            sx={{
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {isPasswordVisible ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </Box>
                        </InputAdornment>
                      }
                      sx={inputSx}
                    />
                  </FormControl>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    {errors.password?.message ? (
                      <FormHelperText error>
                        {errors.password.message}
                      </FormHelperText>
                    ) : (
                      <Box />
                    )}

                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      underline="hover"
                      variant="subtitle2"
                    >
                      Forgot Password?
                    </Link>
                  </Stack>
                </Box>

                {/* TERMS */}
                <Box>
                  <FormControl error={Boolean(errors.terms)}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register('terms', {
                            required:
                              'You must accept Terms & Conditions'
                          })}
                        />
                      }
                      label={
                        <span>
                          I have read and agreed to{' '}
                          <Link
                            component="button"
                            type="button"
                            underline="hover"
                            onClick={() => setOpenTerms(true)}
                          >
                            terms & conditions
                          </Link>
                        </span>
                      }
                    />

                    {errors.terms && (
                      <FormHelperText>
                        {errors.terms.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {/* BUTTON */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.4,
                    mt: 1
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Stack>
            </form>
        </Box>
      </Grid>
      <Dialog
      open={openTerms}
      onClose={() => setOpenTerms(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Terms & Conditions
      </DialogTitle>

      <DialogContent dividers>

        <Typography variant="body2" paragraph>
          Welcome to MyPackage. By using this service, you agree to the following terms and conditions.
        </Typography>

        <Typography variant="body2" paragraph>
          1. Users must provide accurate information.
        </Typography>

        <Typography variant="body2" paragraph>
          2. Password sharing is strictly prohibited.
        </Typography>

        <Typography variant="body2" paragraph>
          3. The company reserves the right to suspend accounts for misuse.
        </Typography>

        <Typography variant="body2" paragraph>
          4. Your data will be handled securely as per privacy policy.
        </Typography>

      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setOpenTerms(false)}
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>

    </Dialog>
    </Grid>
  );
}

AuthLogin.propTypes = { inputSx: PropTypes.any };
