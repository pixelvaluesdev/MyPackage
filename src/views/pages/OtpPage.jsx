// material-ui

import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// project imports
import MainCard from 'components/cards/MainCard';

import profileImg from 'assets/images/users/avatar-4.jpg';
import menuIcon from 'assets/images/menu_icon.png';
import cameraImg from 'assets/images/camera.png';

import { useEffect, useState } from "react";
import { verifyOtp  } from 'api/auth.api';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
 
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const id = localStorage.getItem("user_account_id");
  
  const [formData, setFormData] = useState({
    customer_id: id,
    otp: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("Sending data:", formData);

      const res = await verifyOtp(formData);

      console.log("OTP verified:", res.data);
      // success
      setSnackbar({
        open: true,
        message: "OTP Verify Successfully!User add Successfully Registered!",
        severity: "success"
      });
      
      setTimeout(() => {
        navigate('/user-list');
      }, 2000);
    } catch (error) {
      // show error
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to verify user",
        severity: "error"
      });
      console.error("API ERROR:", error.response?.data || error.message);
    }
  };
  return (
    <Box>
        <Typography
          sx={(theme) => ({
            ...theme.typography.subMenuCaption,
            color: 'black',fontSize:20,textAlign:'center'
          })}
          gutterBottom
        >
          Verify OTP
        </Typography>
        <MainCard sx={{ height: 220 }}>
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
          <Grid container spacing={GRID_SPACING} mb={3}>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ padding: '10px 10px',borderRadius: 2}}>

            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
              <Typography mt={1}
                sx={(theme) => ({
                  ...theme.typography.subMenuCaption,
                  color: 'black',fontSize:13,textAlign:'center'
                })}
                gutterBottom
              >
                Enter 4 Digit OTP
              </Typography>
              <TextField
                placeholder="Enter 4 Digit OTP"
                size="small"
                value={formData.otp}
                onChange={handleChange}
                name="otp"
                fullWidth
                sx={{
                  backgroundColor: '#F4F4F41A',
                  borderRadius: 2
                }}
              >
              
              </TextField>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ padding: '10px 10px',borderRadius: 2}}></Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 5 }} sx={{ borderRadius: 2, textAlign: 'center' }}></Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ borderRadius: 2, textAlign: 'center' }}>
              <Button
                  onClick={handleSubmit}
                  type="submit"
                  variant="contained"
                  fullWidth sx={{
              backgroundColor: '#FF981B' ,borderRadius: 1, textTransform: 'uppercase',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                >
                  confirm
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 5 }} sx={{ borderRadius: 2, textAlign: 'center' }}></Grid>
          </Grid>
        </MainCard>
    </Box>
  );
}
