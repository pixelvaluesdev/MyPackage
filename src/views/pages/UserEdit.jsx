// material-ui

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/cards/MainCard';

import { useEffect, useState } from "react";
import { userEdit, userDetails as getUserDetails   } from '../../api/auth.api';
import { userSchema } from 'utils/validationSchema';
// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  const [userDetails, setUserDetails] = useState(null);
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  
  
  const [formData, setFormData] = useState({
    usr_name: "",
    usr_last_name: "",
    usr_email: "",
    mobile_no: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try { 
        const res = await getUserDetails(user_id);

        const user = res.data?.data || res.data;

        setFormData({
          usr_name: user?.usr_name || "",
          usr_last_name: user?.usr_last_name || "",
          usr_email: user?.usr_email || "",
          mobile_no: user?.mobile_no || "",
        });
      } catch (error) {
        console.error("User fetch error:", error);
      }
    };

    fetchUsers();
  }, [user_id]);

  const handleSubmit = async () => {
    try {
      await userSchema.validate(formData, { abortEarly: false });

      setErrors({});

      const res = await userEdit(user_id,formData);

      console.log("User update:", res.data);
      // success
      setSnackbar({
        open: true,
        message: "User edit successfully!",
        severity: "success"
      });
      
      setTimeout(() => {
        navigate('/user-list');
      }, 2000);
      
    } catch (err) {
      // show error
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Failed to update user",
          severity: "error"
        });
      }
    }
  };

  return (
    <Box>
        <Typography
          sx={(theme) => ({
            ...theme.typography.subMenuCaption,
            color: 'black',fontSize:20
          })}
          gutterBottom
        >
          Manager Edit
        </Typography>
        <MainCard sx={{ height: 450 }}>
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
            <Grid size={{ xs: 12, sm: 6, lg: 6 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
              <Typography mt={1}
                sx={(theme) => ({
                  ...theme.typography.subMenuCaption,
                  color: 'black',fontSize:13
                })}
                gutterBottom
              >
                first name
              </Typography>
              <TextField
                placeholder="First Name"
                value={formData.usr_name}
                onChange={handleChange}
                name="usr_name"
                error={!!errors.usr_name}
                helperText={errors.usr_name}
                size="small"
                fullWidth
                sx={{
                  backgroundColor: '#F4F4F41A',
                  borderRadius: 2
                }}
              >
              
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 6 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
              <Typography mt={1}
                sx={(theme) => ({
                  ...theme.typography.subMenuCaption,
                  color: 'black',fontSize:13
                })}
                gutterBottom
              >
                last name
              </Typography>
              <TextField
                placeholder="Last Name"
                value={formData.usr_last_name}
                onChange={handleChange}
                name="usr_last_name"
                error={!!errors.usr_last_name}
                helperText={errors.usr_last_name}
                size="small"
                fullWidth
                sx={{
                  backgroundColor: '#F4F4F41A',
                  borderRadius: 2
                }}
              >
              
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 6 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
              <Typography mt={1}
                sx={(theme) => ({
                  ...theme.typography.subMenuCaption,
                  color: 'black',fontSize:13
                })}
                gutterBottom
              >
                Email
              </Typography>
              <TextField
                placeholder="Email"
                value={formData.usr_email}
                onChange={handleChange}
                name="usr_email"
                error={!!errors.usr_email}
                helperText={errors.usr_email}
                size="small"
                fullWidth
                sx={{
                  backgroundColor: '#F4F4F41A',
                  borderRadius: 2
                }}
              >
              
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 6 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
              <Typography mt={1}
                sx={(theme) => ({
                  ...theme.typography.subMenuCaption,
                  color: 'black',fontSize:13
                })}
                gutterBottom
              >
                mobile number
              </Typography>
              <TextField
                placeholder="Mobile Number"
                value={formData.mobile_no}
                onChange={handleChange}
                name="mobile_no"
                error={!!errors.mobile_no}
                helperText={errors.mobile_no}
                size="small"
                fullWidth
                sx={{
                  backgroundColor: '#F4F4F41A',
                  borderRadius: 2
                }}
              >
              
              </TextField>
            </Grid>
            
            
            <Grid size={{ xs: 12, sm: 6, lg: 1 }} sx={{ borderRadius: 2, textAlign: 'center' }}>
              <Button
                  type="submit"
                  variant="contained"
                  fullWidth sx={{
              backgroundColor: '#D9D9D9' ,borderRadius: 1, textTransform: 'uppercase',fontSize: 10, color: 'black' }}
                >
                  cancel
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 1 }} sx={{ borderRadius: 2, textAlign: 'center' }}>
              <Button
                  onClick={handleSubmit}
                  type="submit"
                  variant="contained"
                  fullWidth sx={{
              backgroundColor: '#FF981B' ,borderRadius: 1, textTransform: 'uppercase',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                >
                  Update
              </Button>
            </Grid>
          </Grid>
        </MainCard>
    </Box>
  );
}
