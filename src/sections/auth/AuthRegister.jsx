import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// third party
import { useForm } from 'react-hook-form';
import { lockersDetails as getLockerDetails, customerAdd } from '../../api/auth.api';

// utils
import { emailSchema, firstNameSchema, lastNameSchema, contactSchema, ageSchema, flatSchema, floorSchema, buildingSchema } from 'utils/validationSchema';

// ==============================|| AUTH - REGISTER ||============================== //

export default function AuthRegister({ inputSx }) {
  const [lockersDetails, setLockerDetails] = useState(null);
  const { locker_id } = useParams();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const locker_id_decrypt = atob(locker_id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const resLockers = await getLockerDetails(locker_id_decrypt);
        
        setLockerDetails(resLockers.data.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [locker_id_decrypt]);
  
  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await customerAdd(data);

      console.log("API Response:", res);
      setSnackbar({
        open: true,
        message: "User added successfully! Please verify OTP to Register and Confirm your account!",
        severity: "success"
      });
      localStorage.setItem('customer_id', res.data.data.id);
      setTimeout(() => {
        navigate('/otp-check/' + locker_id);
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to add user",
        severity: "error"
      });
      console.error("Submit Error:", error);
    }
  };

  return (
    <>
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
      <Box>
        <Typography color="text.primary" gutterBottom variant="h4">
          {lockersDetails?.locker_name} ({lockersDetails?.locker_code})
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '11px' }} color="text.secondary">
          {lockersDetails?.area}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <input
              type="hidden"
              value={locker_id_decrypt}
              {...register('locker_id')}
            />
            <TextField
              {...register('first_name', firstNameSchema)}
              fullWidth
              label="First Name"
              name="first_name"
              error={Boolean(errors.first_name)}
              sx={inputSx}
            />
            {errors.first_name?.message && <FormHelperText error>{errors.first_name.message}</FormHelperText>}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('last_name', lastNameSchema)}
              fullWidth
              label="Last Name"
              name="last_name"
              error={Boolean(errors.last_name)}
              sx={inputSx}
            />
            {errors.last_name?.message && <FormHelperText error>{errors.last_name.message}</FormHelperText>}
          </Grid>
          <Grid size={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              {...register('email', emailSchema)}
              placeholder="example@gmail.com"
              fullWidth
              label="Email Address"
              error={Boolean(errors.email)}
              sx={inputSx}
            />
            {errors.email?.message && <FormHelperText error>{errors.email.message}</FormHelperText>}
          </Grid>
          <Grid size={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              {...register('phone_no', contactSchema)}
              placeholder="Phone Number"
              fullWidth
              label="Phone Number"
              error={Boolean(errors.phone_no)}
              sx={inputSx}
            />
            {errors.phone_no?.message && <FormHelperText error>{errors.phone_no.message}</FormHelperText>}
          </Grid>
          <Grid size={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              {...register('age', ageSchema)}
              placeholder="Age"
              fullWidth
              label="Age"
              error={Boolean(errors.age)}
              sx={inputSx}
            />
            {errors.age?.message && <FormHelperText error>{errors.age.message}</FormHelperText>}
          </Grid>
          <Grid size={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              {...register('flat_no', flatSchema)}
              placeholder="Flat Number"
              fullWidth
              label="Flat Number"
              error={Boolean(errors.flat_no)}
              sx={inputSx}
            />
            {errors.flat_no?.message && <FormHelperText error>{errors.flat_no.message}</FormHelperText>}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              {...register('building_no', buildingSchema)}
              placeholder="Building Number"
              fullWidth
              label="Building Number"
              error={Boolean(errors.building_no)}
              sx={inputSx}
            />
            {errors.building_no?.message && <FormHelperText error>{errors.building_no.message}</FormHelperText>}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              {...register('floor_no', floorSchema)}
              placeholder="Floor Number"
              fullWidth
              label="Floor Number"
              error={Boolean(errors.floor_no)}
              sx={inputSx}
            />
            {errors.floor_no?.message && <FormHelperText error>{errors.floor_no.message}</FormHelperText>}
          </Grid>
          <Grid size={{ xs: 6, sm: 6 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              // endIcon={<CircularProgress color="#FF981B" size={16} />}
              sx={{ backgroundColor: '#FF981B', minWidth: 120, mt: { xs: 1, sm: 3 }, '& .MuiButton-endIcon': { ml: 1 } }}
            >
              Confirm
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: 6 }}>
            <Button
              type="button"
              variant="contained"
              fullWidth
              // endIcon={<CircularProgress color="#FF981B" size={16} />}
              sx={{ color:'#000',backgroundColor: '#ccc', minWidth: 120, mt: { xs: 1, sm: 3 }, '& .MuiButton-endIcon': { ml: 1 } }}
            >
              Edit
            </Button>
          </Grid>
        </Grid>

      </form>
    </>
  );
}

AuthRegister.propTypes = { inputSx: PropTypes.any };
