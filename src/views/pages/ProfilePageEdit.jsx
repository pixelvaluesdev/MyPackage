// material-ui

import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// project imports
import MainCard from 'components/cards/MainCard';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import profileImg from 'assets/images/users/avatar-4.jpg';
import menuIcon from 'assets/images/menu_icon.png';
import cameraImg from 'assets/images/camera.png';

import { useEffect, useState, useRef } from "react";
import { profileDetails, updateProfile } from 'api/auth.api';
// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  const [logo, setLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);
  
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_no: "",
    app_name: "",
    profile_img: "",
    file: null
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const fileInputRef = useRef(null);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileDetails();
        const profile = res.data?.data || {};

        setProfileForm({
          first_name: profile.usr_name || "",
          last_name: profile.usr_last_name || "",
          email: profile.usr_email || "",
          mobile_no: profile.mobile_no || "",
          app_name: profile.app_name || "",
          profile_img: profile.profile_img || ""
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  // Image click
  const handleImageClick = () => fileInputRef.current.click();

  // Profile image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Type validation
    if (!file.type.startsWith("image/")) {
      setSnackbar({ open: true, message: "Only image allowed", severity: "error" });
      return;
    }

    // ✅ Size validation
    if (file.size > 2 * 1024 * 1024) {
      setSnackbar({ open: true, message: "Max size 2MB", severity: "error" });
      return;
    }

    const preview = URL.createObjectURL(file);

    setProfileForm(prev => ({
      ...prev,
      profile_img: preview,
      file
    }));
  };

  // Logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    console.log("LOGO FILE:", file); // must not be undefined
    setLogo(file);
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSnackbar({ open: true, message: "Only image allowed", severity: "error" });
      return;
    }

    setFavicon(file);
  };

  // Save
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("first_name", profileForm.first_name);
      formData.append("last_name", profileForm.last_name);
      formData.append("email", profileForm.email);
      formData.append("mobile_no", profileForm.mobile_no);
      formData.append("app_name", profileForm.app_name);

      if (profileForm.file) {
        formData.append("file", profileForm.file);
      }

      if (logo) {
        formData.append("logo", logo);
      }

      if (favicon) {
        formData.append("favicon", favicon);
      }

      await updateProfile(formData);

      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success"
      });

    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Update failed",
        severity: "error"
      });
    }
  };

  return (
    <Box>
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
        <MainCard sx={{ height: 450 }}>
          <Grid container spacing={GRID_SPACING}>
            <Grid size={{ xs: 12, sm: 6, lg: 1 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
              <IconButton size="small">
                <CardMedia component="img" image={profileForm.profile_img
      ? profileForm.profile_img
      : profileImg} alt="profile" sx={{ width: 70, height: 70, borderRadius: '50%' }} />
                <CardMedia component="img" onClick={handleImageClick} image={cameraImg} alt="profile" sx={{ width: 20, height: 20, zIndex: 999, position: 'absolute',bottom: 8,right:2 }} />
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
              </IconButton>
              
            </Grid>  
            {/* <Grid mt={3} size={{ xs: 12, sm: 6, lg: 1 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
              <Button
                  type="submit"
                  variant="contained"
                  fullWidth sx={{
              backgroundColor: '#FF981B' ,borderRadius: 1, textTransform: 'uppercase',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                >
                  edit
              </Button>
            </Grid>   */}
          </Grid>
          <Grid container spacing={GRID_SPACING} mb={3}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
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
                name="first_name"
                value={profileForm.first_name}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={{
                  backgroundColor: '#F4F4F41A',
                  borderRadius: 2
                }}
              >
              
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
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
                name="last_name"
                value={profileForm.last_name}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={{
                  backgroundColor: '#F4F4F41A',
                  borderRadius: 2
                }}
              >
              
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
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
                size="small"
                fullWidth
                name="email"
                value={profileForm.email}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  backgroundColor: '#2b2a2a1a',
                  borderRadius: 2
                }}
              >
              
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
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
                size="small"
                name="mobile_no"
                value={profileForm.mobile_no}
                onChange={handleChange}
                fullWidth
                sx={{
                  backgroundColor: '#F4F4F41A',
                  borderRadius: 2
                }}
              >
              
              </TextField>
            </Grid>
            {localStorage.getItem('user_role') === 'admin' && (
            <Grid size={{ xs: 12, sm: 6, lg: 12 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
              <Typography 
                sx={(theme) => ({
                  ...theme.typography.subMenuCaption,
                  color: 'black',fontSize:13
                })}
                gutterBottom
              >
                app name
              </Typography>
              <TextField
                placeholder="App Name"
                size="small"
                name="app_name"
                value={profileForm.app_name}
                onChange={handleChange}
                fullWidth
                sx={{
                  backgroundColor: '#F4F4F41A',
                  borderRadius: 2
                }}
              >
              
              </TextField>
            </Grid>
            )}
            {/* <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
              <Typography 
                sx={(theme) => ({
                  ...theme.typography.subMenuCaption,
                  color: 'black',fontSize:13
                })}
                gutterBottom
              >
                Upload Logo
              </Typography>
              <Button variant="contained" component="label" fullWidth sx={{
              backgroundColor: '#FF981B' ,borderRadius: 1, textTransform: 'uppercase',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}>
                Upload Logo
                <input hidden type="file" accept="image/*" onChange={handleLogoChange} />
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
              <Typography 
                sx={(theme) => ({
                  ...theme.typography.subMenuCaption,
                  color: 'black',fontSize:13
                })}
                gutterBottom
              >
                Upload Favicon
              </Typography>
              <Button variant="contained" component="label" fullWidth sx={{
              backgroundColor: '#FF981B' ,borderRadius: 1, textTransform: 'uppercase',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}>
                Upload Favicon
                <input hidden type="file" accept="image/*" onChange={handleFaviconChange} />
              </Button>
            </Grid> */}
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
                  onClick={handleSave}
                  type="submit"
                  variant="contained"
                  fullWidth sx={{
              backgroundColor: '#FF981B' ,borderRadius: 1, textTransform: 'uppercase',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                >
                  update
              </Button>
            </Grid>
          </Grid>
        </MainCard>
    </Box>
  );
}
