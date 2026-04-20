import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
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
import { lockersDetails as getLockerDetails, otpCheck } from '../../api/auth.api';

import { otpSchema } from 'utils/validationSchema';

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
  // Initialize react-hook-form
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

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const finalOtp = otp.join("");
    const payload = {
      ...data,
      otp: finalOtp
    };
    try {
      const res = await otpCheck(payload);

      console.log("API Response:", res);
      setSnackbar({
        open: true,
        message: "OTP verified successfully!You are onboarded successfully!",
        severity: "success"
      });

      setTimeout(() => {
        navigate('/register/' + locker_id);
      }, 3000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to add user",
        severity: "error"
      });
      console.error("Submit Error:", error);
    }
  };

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move back on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
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
          
          <Grid size={12}>
            <Typography mt={1}
                sx={(theme) => ({
                  ...theme.typography.subMenuCaption,
                  color: 'black',fontSize:16
                })}
                gutterBottom
              >
                Enter 4 Digit OTP
              </Typography>
            <input type="hidden" {...register('customer_id')} value={localStorage.getItem('customer_id')} name="customer_id" />
            <Box display="flex" gap={2}>
              
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  value={digit}
                  name="otp"
                  inputRef={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "20px" }
                  }}
                  sx={{ width: 50, height: 50, '& input': { textAlign: 'center', padding: '10px' } }}
                />
              ))}
            </Box>
            
            {errors.otp?.message && <FormHelperText error>{errors.otp.message}</FormHelperText>}
          </Grid>
          
          <Grid size={{ xs: 12, sm: 12 }}>
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
          
        </Grid>

      </form>
    </>
  );
}

AuthRegister.propTypes = { inputSx: PropTypes.any };
