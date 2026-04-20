import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// material-ui
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import { GRID_SPACING } from 'config';
import MainCard from './MainCard';
import { dashboardFilter, dashboard } from 'api/auth.api';
import { useLocation, useParams } from "react-router-dom";
// ==============================|| TRAFFIC SOURCE CARD ||============================== //

export default function TrafficSourceCard({ cardTitle }) {
  const [items, setItems] = useState([]);

  const [activeChart, setActiveChart] = useState('compartment');
  const [dashboardData, setDashboardData] = useState(null);
  
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const cleanState = params.get("state") || "";
  const cleanCity = params.get("city") || "";
  const cleanArea = params.get("area") || "";
  const cleanPeriod = params.get("period") || "";

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setDashboardData(null);
              const hasFilter =
                cleanState !== "" ||
                cleanCity !== "" ||
                cleanArea !== "" ||
                cleanPeriod !== "";
        
        const response = hasFilter
                ? await dashboardFilter(15, cleanState, cleanCity, cleanArea, cleanPeriod)
                : await dashboard(15);
        const vendorData = response?.data?.data?.vendorComparision;

        if (!vendorData) return;

        const mappedItems = Object.entries(vendorData).map(([vendor, info]) => ({
          label: vendor.charAt(0).toUpperCase() + vendor.slice(1).toLowerCase(),
          percentage: parseFloat(info.percentage),
          progressValue: parseFloat(info.percentage),
          progressColor: getProgressColor(parseFloat(info.percentage))
        }));

        setItems(mappedItems);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };

    fetchVendorData();
  }, [location.search]);

  const getProgressColor = (percentage) => {
    if (percentage >= 50) return 'success';
    if (percentage >= 20) return 'warning';
    return 'error';
  };

  return (
    <MainCard title={cardTitle || 'Vendor Comparison'}>
      <Stack sx={{ gap: GRID_SPACING }}>
        {items.map((item, index) => (
          <Stack key={index} sx={{ gap: 1 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2">{item.label}</Typography>
              <Typography variant="body2" align="right">
                {item.percentage}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              aria-label={item.label}
              value={item.progressValue}
              color={item.progressColor}
            />
          </Stack>
        ))}
      </Stack>
    </MainCard>
  );
}

TrafficSourceCard.propTypes = {
  cardTitle: PropTypes.string
};