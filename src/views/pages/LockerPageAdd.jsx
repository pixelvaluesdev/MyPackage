// material-ui

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
// project imports
import MainCard from 'components/cards/MainCard';
import Snackbar from '@mui/material/Snackbar';
import Alert, { alertClasses } from '@mui/material/Alert';
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { getStates, getCities, lockerAdd, getCitiesByStateId  } from 'api/auth.api';
// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  const libraries = ["places"];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBx9ZKDGqCuGIlboDZ-KTZcsPkOazI9l6Y",
    libraries
  });

  const autocompleteRef = useRef(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await getStates();
        setStates(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);
  
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState) {
        setCities([]);
        setFormData(prev => ({ ...prev, city: "" }));
        return;
      }

      try {
        const res = await getCitiesByStateId(selectedState);
        const cityList = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCities(cityList);
        setFormData(prev => ({ ...prev, city: "" }));
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    };

    fetchCities();
  }, [selectedState]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      status: "active"
    }
  });

  const [formData, setFormData] = useState({
    locker_name: "",
    state:"",
    area: "",
    city: "",
    latitude: "",
    longitude: "",
    s_compartment: "",
    l_compartment: "",
    m_compartment: "",
    exl_compartment: "",
    status: "active"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: (name === "city" || name === "state") ? Number(value) : value
    });
  };

  const handlePlaceChanged = () => {

    const place = autocompleteRef.current.getPlace();

    if (!place || !place.geometry) return;

    const address = place.formatted_address;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setValue("area", address);
    setValue("latitude", lat);
    setValue("longitude", lng);

  };

  const onSubmit = async (data) => {
    try {

      const res = await lockerAdd(data);

      setSnackbar({
        open: true,
        message: "Locker added successfully!",
        severity: "success"
      });

      reset(); // clear form

    } catch (error) {

      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to add locker",
        severity: "error"
      });
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
          Locker Add
        </Typography>
        
        <MainCard mt={3} sx={{ height: 450 }}>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={GRID_SPACING} mb={3}>
              
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
                <Typography
                  sx={(theme) => ({
                    ...theme.typography.subMenuCaption,
                    color: 'black',fontSize:13
                  })}
                  gutterBottom
                >
                  locker name
                </Typography>
                <TextField
                  placeholder="Locker Name"
                  name="locker_name"
                  size="small"
                  fullWidth
                  {...register("locker_name", {
                    required: "Locker name is required"
                  })}
                  sx={{
                    backgroundColor: '#F4F4F41A',
                    borderRadius: 2
                  }}
                  error={!!errors.locker_name}
                  helperText={errors.locker_name?.message}
                >
                
                </TextField>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
                <Typography
                  sx={(theme) => ({
                    ...theme.typography.subMenuCaption,
                    color: 'black',fontSize:13
                  })}
                  gutterBottom
                >
                  state
                </Typography>
                <TextField
                  select
                  size="small"
                  fullWidth
                  defaultValue=""
                  {...register("state", {
                    required: "State is required"
                  })}
                  error={!!errors.state}
                  helperText={errors.state?.message}
                  onChange={(e) => {

                    const value = Number(e.target.value);

                    setSelectedState(value);

                    setValue("state", value);

                  }}
                  SelectProps={{ displayEmpty: true }}
                  sx={{
                    backgroundColor: '#F4F4F41A',
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                        color: 'black',
                        fontSize: 12
                      },

                      // icon color
                      '& .MuiSvgIcon-root': {
                        color: 'black',
                        fontSize: 18
                      }
                  }}
                >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
                  {states.map((option) => (
                    <MenuItem key={option.state_id} value={option.state_id} sx={{ textTransform: 'capitalize' }}>
                      {option.state_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
                <Typography
                  sx={(theme) => ({
                    ...theme.typography.subMenuCaption,
                    color: 'black',fontSize:13
                  })}
                  gutterBottom
                >
                  City
                </Typography>
                <TextField
                  select
                  size="small"
                  fullWidth
                  name="city"
                  defaultValue=""
                  onChange={handleChange}
                  {...register("city", {
                    required: "City is required"
                  })}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  SelectProps={{ displayEmpty: true }}
                  sx={{
                    backgroundColor: '#F4F4F41A',
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                        color: 'black',
                        fontSize: 12
                      },

                      // icon color
                      '& .MuiSvgIcon-root': {
                        color: 'black',
                        fontSize: 18
                      }
                  }}
                >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
                  {cities.map((option) => (
                    <MenuItem key={option.city_id} value={option.city_id} sx={{ textTransform: 'capitalize' }}>
                      {option.city_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 6 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
                <Typography
                  sx={(theme) => ({
                    ...theme.typography.subMenuCaption,
                    color: 'black',fontSize:13
                  })}
                  gutterBottom
                >
                  Address
                </Typography>
                {isLoaded && (
                  <Autocomplete
                    onLoad={(ref) => (autocompleteRef.current = ref)}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search address"
                      {...register("area", {
                        required: "Address is required"
                      })}
                      error={!!errors.area}
                      helperText={errors.area?.message}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          area: e.target.value
                        }))
                      }
                    />
                  </Autocomplete>
                )}
                
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
                <Typography 
                  sx={(theme) => ({
                    ...theme.typography.subMenuCaption,
                    color: 'black',fontSize:13
                  })}
                  gutterBottom
                >
                  Latitude
                </Typography>
                <TextField
                  placeholder="Latitude"
                  size="small"
                  fullWidth
                  name="latitude"
                  {...register("latitude", {
                    required: "Latitude is required"
                  })}
                  error={!!errors.latitude}
                  helperText={errors.latitude?.message}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: '#F4F4F41A',
                    borderRadius: 2
                  }}
                >
                
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '10px 10px',borderRadius: 2}}>
                <Typography 
                  sx={(theme) => ({
                    ...theme.typography.subMenuCaption,
                    color: 'black',fontSize:13
                  })}
                  gutterBottom
                >
                  longitude
                </Typography>
                <TextField
                  placeholder="Longitude"
                  size="small"
                  fullWidth
                  name="longitude"
                  {...register("longitude", {
                    required: "Longitude is required"
                  })}
                  error={!!errors.longitude}
                  helperText={errors.longitude?.message}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: '#F4F4F41A',
                    borderRadius: 2
                  }}
                >
                
                </TextField>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, lg: 12 }} sx={{ padding: '10px 10px 0px',borderRadius: 2}}>
                <Typography 
                  sx={(theme) => ({
                    ...theme.typography.subMenuCaption,
                    color: 'black',fontSize:15
                  })}
                  gutterBottom
                >
                  Compartment Count (In Numbers)
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '0px 10px',borderRadius: 2}}>
                <Typography 
                  sx={(theme) => ({
                    ...theme.typography.subMenuCaption,
                    color: 'black',fontSize:13
                  })}
                  gutterBottom
                >
                  Small Count
                </Typography>
                <TextField
                  placeholder="Small Count"
                  size="small"
                  fullWidth
                  name="s_compartment"
                  {...register("s_compartment", {
                    required: "Small Count is required"
                  })}
                  error={!!errors.s_compartment}
                  helperText={errors.s_compartment?.message}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: '#F4F4F41A',
                    borderRadius: 2
                  }}
                >
                
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '0px 10px',borderRadius: 2}}>
                <Typography 
                  sx={(theme) => ({
                    ...theme.typography.subMenuCaption,
                    color: 'black',fontSize:13
                  })}
                  gutterBottom
                >
                  Medium Count
                </Typography>
                <TextField
                  placeholder="Medium Count"
                  size="small"
                  fullWidth
                  name="m_compartment"
                  {...register("m_compartment", {
                    required: "Medium Count is required"
                  })}
                  error={!!errors.m_compartment}
                  helperText={errors.m_compartment?.message}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: '#F4F4F41A',
                    borderRadius: 2
                  }}
                >
                
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '0px 10px',borderRadius: 2}}>
                <Typography 
                  sx={(theme) => ({
                    ...theme.typography.subMenuCaption,
                    color: 'black',fontSize:13
                  })}
                  gutterBottom
                >
                  Large Count
                </Typography>
                <TextField
                  placeholder="Large Count"
                  size="small"
                  fullWidth
                  name="l_compartment"
                  {...register("l_compartment", {
                    required: "Large Count is required"
                  })}
                  error={!!errors.l_compartment}
                  helperText={errors.l_compartment?.message}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: '#F4F4F41A',
                    borderRadius: 2
                  }}
                >
                
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '0px 10px',borderRadius: 2}}>
                <Typography 
                  sx={(theme) => ({
                    ...theme.typography.subMenuCaption,
                    color: 'black',fontSize:13
                  })}
                  gutterBottom
                >
                  Exl Count
                </Typography>
                <TextField
                  placeholder="Extra Large Count"
                  size="small"
                  fullWidth
                  name="xl_compartment"
                  {...register("exl_compartment", {
                    required: "Extra Large Count is required"
                  })}
                  error={!!errors.exl_compartment}
                  helperText={errors.exl_compartment?.message}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: '#F4F4F41A',
                    borderRadius: 2
                  }}
                >
                
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 1 }} sx={{ padding: '0px 10px',borderRadius: 2, textAlign: 'center' }}>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth sx={{
                backgroundColor: '#D9D9D9' ,borderRadius: 1, textTransform: 'uppercase',fontSize: 10, color: 'black' }}
                  >
                    cancel
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 1 }} sx={{ padding: '0px 10px',borderRadius: 2, textAlign: 'center' }}>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth sx={{
                backgroundColor: '#FF981B' ,borderRadius: 1, textTransform: 'uppercase',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                  >
                    save
                </Button>
              </Grid>
            </Grid>
          </form>
        </MainCard>
    </Box>
  );
}
