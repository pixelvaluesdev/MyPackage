import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth.api';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';

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
import loginImage from 'assets/images/login_bg.png';
import loginLogo from 'assets/images/mypackage_logos.png';
import loginSqr from 'assets/images/login_sqr.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useForm } from 'react-hook-form';

import { emailSchema, passwordSchema } from 'utils/validationSchema';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ==============================|| AUTH - LOGIN ||============================== //

export default function AuthLogin({ inputSx }) {

  
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
    } = useForm({
    defaultValues: {
        email: "",
        password: "",
        confirm_password: ""
    }
  });

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    //alert(JSON.stringify(data));
    try {

      if (data.password !== data.confirm_password) {

        setSnackbar({
          open: true,
          message: "Passwords do not match",
          severity: "error"
        });

        return;
      }

      setLoading(true);

      const res = await resetPassword(data);
      //alert(res.data);
      setSnackbar({
        open: true,
        message: res.data.message || "Password reset successfully",
        severity: "success"
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      //alert(err);
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message ||
          "This Email is not registered.Please check your email!",
        severity: "error"
      });

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
       Forgot Password
      </Typography>

      <Typography variant="body1" sx={{ opacity: 0.9 }} mb={4}>
        Please enter your details to continue
      </Typography>
    </Box>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ gap: 3 }}>
        <Box>
          <Typography variant="subtitle2" mb={1} fontWeight={500}>
            Username
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            {...register('email', emailSchema)}
            placeholder="example@mypackage.com"
            fullWidth
            label="Email Address / Username"
            error={Boolean(errors.email)}
            sx={inputSx}
          />
          {errors.email?.message && <FormHelperText error>{errors.email.message}</FormHelperText>}
        </Box>

        <Box>
          <Typography variant="subtitle2" mb={1} fontWeight={500}>
            New Password
          </Typography>
          <FormControl fullWidth error={Boolean(errors.password)}>
            <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
            <OutlinedInput
              {...register('password', passwordSchema)}
              id="outlined-adornment-password"
              type={isPasswordVisible ? 'text' : 'password'}
              label="Enter new password"
              endAdornment={
                <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                </InputAdornment>
              }
              sx={inputSx}
            />
          </FormControl>
            {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
        </Box>

        <Box>
          <Typography variant="subtitle2" mb={1} fontWeight={500}>
            Confirm Password
          </Typography>
          <FormControl fullWidth error={Boolean(errors.confirm_password)}>
            <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
            <OutlinedInput
              {...register("confirm_password", {
                  validate: value =>
                    value === passwordValue ||
                    "Passwords do not match"
            })}
              id="outlined-adornment-password"
              type={isPasswordVisible ? 'text' : 'password'}
              label="Enter confirm password"
              endAdornment={
                <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                </InputAdornment>
              }
              sx={inputSx}
            />
          </FormControl>
            {errors.confirm_password?.message && <FormHelperText error>{errors.confirm_password.message}</FormHelperText>}
        </Box>
        <Box>
          
        </Box>
      </Stack>

      <Button
        type="submit"
        variant="contained" 
        fullWidth
        disabled={loading}
      >
        {loading ? 'Resetting Password...' : 'Reset Password'}
      </Button>
    </form>
    </Box>
      </Grid>
    </Grid>
  );
}

AuthLogin.propTypes = { inputSx: PropTypes.any };
