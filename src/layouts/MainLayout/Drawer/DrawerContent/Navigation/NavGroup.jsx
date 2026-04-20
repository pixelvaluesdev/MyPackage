import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';
import { getStates, getCities, getCitiesByStateId } from 'api/auth.api';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";

export default function NavGroup() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState(""); // today, week, month, year

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  // Fetch States
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

  // Fetch Cities
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

  const [formData, setFormData] = useState({
    locker_name: "",
    state:"",
    area: "",
    city: "",
    latitude: "",
    longitude: "",
    status: "active"
  });
  
  const periodButtonStyle = (period) => ({
    backgroundColor: selectedPeriod === period ? '#FF981B' : '#F4F4F41A',
    color: 'white',
    textTransform: 'capitalize',
    fontSize: 12,
    borderRadius: 2,
    '&:hover': { backgroundColor: '#FF981B' },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "city" ? Number(value) : value
    });
  };

  // Filter handler
  const handleFilter = () => {
    const query = new URLSearchParams({
      state: selectedState || "",
      city: selectedCity || "",
      area: formData.area?.trim() || "",
      period: selectedPeriod || ""
    }).toString();

    navigate(`/analytics?${query}`);
  };

  return (
    <Box sx={{ px: 2 }}>
      {/* Title */}
      <Typography
        sx={(theme) => ({
          ...theme.typography.menuCaption,
          color: 'white',
          fontSize: 25,
          fontWeight: 600,
          textTransform: 'capitalize',
          marginLeft: -2
        })}
        gutterBottom
      >
        dashboard
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={(theme) => ({
          ...theme.typography.subMenuCaption,
          color: 'white'
        })}
        gutterBottom
      >
        Operational Insights
      </Typography>

      {/* Dropdown label */}
      <Typography mt={3}
        sx={(theme) => ({
          ...theme.typography.subMenuCaption,
          color: 'white'
        })}
        gutterBottom
      >
        state
      </Typography>

      <TextField
        select
        size="small"
        fullWidth
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        SelectProps={{ displayEmpty: true }}
        sx={{
          backgroundColor: '#F4F4F41A',
          borderRadius: 2,
          '& .MuiSelect-select': {
              color: 'white',
              fontSize: 12
            },

            // icon color
            '& .MuiSvgIcon-root': {
              color: 'white',
              fontSize: 18
            }
        }}
      >
      <MenuItem value="" disabled>
        Select
      </MenuItem>
      {states.map((option) => (
        <MenuItem
          key={option.state_id}
          value={option.state_id}
          sx={{ textTransform: 'capitalize' }}
        >
          {option.state_name}
        </MenuItem>
      ))}
      </TextField>

      <Typography mt={1}
        sx={(theme) => ({
          ...theme.typography.subMenuCaption,
          color: 'white'
        })}
        gutterBottom
      >
        city
      </Typography>

      <TextField
        select
        size="small"
        fullWidth
        name="city"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        SelectProps={{ displayEmpty: true }}
        sx={{
          backgroundColor: '#F4F4F41A',
          borderRadius: 2,
          '& .MuiSelect-select': {
              color: 'white',
              fontSize: 12
            },

            // icon color
            '& .MuiSvgIcon-root': {
              color: 'white',
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

      <Typography mt={1}
        sx={(theme) => ({
          ...theme.typography.subMenuCaption,
          color: 'white'
        })}
        gutterBottom
      >
        area
      </Typography>

      <TextField
        size="small"
        placeholder="Enter Area"
        fullWidth
        name="area"
        value={formData.area}
        onChange={handleChange}
        sx={{
          backgroundColor: '#F4F4F41A',
          borderRadius: 2,
          '& input': {
            color: '#fff'
          },

          // ⭐ placeholder color
          '& input::placeholder': {
            color: '#ccc',
            opacity: 1,
            fontSize:12
          }
        }}
      >
      
      </TextField>

      <Typography mt={1}
        sx={(theme) => ({
          ...theme.typography.subMenuCaption,
          color: 'white'
        })}
        gutterBottom
      >
        Time Frame
      </Typography>

      <Grid container spacing={GRID_SPACING} pb={1}>
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <Button
              type="submit"
              variant="contained"
              fullWidth sx={periodButtonStyle('today')} onClick={() => setSelectedPeriod('today')}>
              Today
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <Button
              type="submit"
              variant="contained"
              fullWidth sx={periodButtonStyle('week')} onClick={() => setSelectedPeriod('week')}>
              This Week
          </Button>
        </Grid>
        </Grid>
        <Grid container spacing={GRID_SPACING} pb={1}>
        <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
          <Button
              type="submit"
              variant="contained"
              fullWidth sx={periodButtonStyle('month')} onClick={() => setSelectedPeriod('month')}>
              This Month
          </Button>
      </Grid>
      </Grid>
      <Grid container spacing={GRID_SPACING} mb={5}>
      <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
          <Button
              type="submit"
              variant="contained"
              fullWidth sx={periodButtonStyle('year')} onClick={() => setSelectedPeriod('year')}>
              This Year
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
          <Button
              type="submit"
              variant="contained"
              fullWidth 
              startIcon={<SearchIcon />}
              onClick={handleFilter}
              sx={{
          backgroundColor: '#FF981B' ,borderRadius: 2, textTransform: 'capitalize',fontSize: 15, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
            >
              Filter
          </Button>
      </Grid>
      </Grid>
    </Box>
  );
}

