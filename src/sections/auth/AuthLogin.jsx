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
    <Grid container spacing={GRID_SPACING}>
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
      <Grid size={{ xs: 12, sm: 6, lg: 5 }}>
        <Box
          sx={{
            position: 'relative',
            height: '100vh',
            width:'100vh',
            backgroundImage: `url(${loginImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* 🔹 Logos row (square first, then logo) */}
          <Box
            sx={{
              position: 'absolute',
              top: 30,
              left: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {/* FIRST */}
            <Box component="img" src={loginSqr} alt="square-logo" sx={{ width: 24 }} />
             {/* <Typography variant="h3" ml="{2}" gutterBottom sx={{ height:'30px', width:'0px',color:'#fff', }}>|</Typography> */}
            {/* SECOND */}
            <Box component="img" src={loginLogo} alt="logo" sx={{ width: 140,marginleft:'10px' }} />
          </Box>

          {/* 🔹 Center content */}
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              textAlign: 'center',
              px: 4
            }}
          >
            {/* your text here */}
          </Box>
        </Box>
      </Grid>

      <Grid py={5} px={5} size={{ xs: 12, sm: 6, lg: 7 }} sx={{ padding:'120px',backgroundColor:'#fff' }}>
      <Box>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
       Sign In
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
            name="email"
            {...register('email', emailSchema)}
            placeholder="example@materially.com"
            fullWidth
            label="Email Address / Username"
            error={Boolean(errors.email)}
            sx={inputSx}
          />
          {errors.email?.message && <FormHelperText error>{errors.email.message}</FormHelperText>}
        </Box>

        <Box>
          <Typography variant="subtitle2" mb={1} fontWeight={500}>
            Password
          </Typography>
          <FormControl fullWidth error={Boolean(errors.password)}>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              {...register('password', passwordSchema)}
              id="outlined-adornment-password"
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              label="Password"
              placeholder="Enter your password"
              endAdornment={
                <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                </InputAdornment>
              }
              sx={inputSx}
            />
          </FormControl>
          <Stack
            direction="row"
            sx={{ alignItems: 'flex-start', justifyContent: errors.password ? 'space-between' : 'flex-end', width: 1, gap: 1 }}
          >
            {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
            <Link
              component={RouterLink}
              underline="hover"
              variant="subtitle2"
              to="/forgot-password"
              textAlign="right"
              sx={{ '&:hover': { color: 'primary.dark' }, mt: 0.375, whiteSpace: 'nowrap' }}
            >
              Forgot Password?
            </Link>
          </Stack>
        </Box>
        <Box>
          <FormControl error={Boolean(errors.terms)}>
            <FormControlLabel
              control={
                <Checkbox
                  {...register('terms', {
                    required: 'You must accept Terms & Conditions'
                  })}
                />
              }
              label={
                <span>
                  I have read and agreed to{' '}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => setOpenTerms(true)}
                    underline="hover"
                  >
                    terms & conditions
                  </Link>
                </span>
              }
            />

            {errors.terms && (
              <FormHelperText>{errors.terms.message}</FormHelperText>
            )}
          </FormControl>
        </Box>
      </Stack>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
      >
        {loading ? 'Signing In...' : 'Sign in'}
      </Button>
    </form>
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
