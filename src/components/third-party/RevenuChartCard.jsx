import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import ReactApexChart from 'react-apexcharts';

// project imports
import MainCard from 'components/cards/MainCard';
import { dashboard } from 'api/auth.api';

export default function RevenueChartCard({ title, bottomData }) {
  const theme = useTheme();
  const onlySM = useMediaQuery(theme.breakpoints.only('sm'));

  const [chartData, setChartData] = useState({
    options: {
      dataLabels: { enabled: false },
      yaxis: { min: 0, max: 100 },
      labels: ['Small', 'Large', 'Extra Large', 'Medium'],
      legend: {
        show: true,
        position: 'right',
        fontFamily: 'inherit',
        labels: { colors: 'inherit' },
        itemMargin: { horizontal: 5, vertical: 2 }
      }
    },
    series: [] // initially empty
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboard(15);
        const data = response?.data?.data?.compartmentSizeOccupency;

        if (!data) {
          console.warn('compartmentSizeOccupency not found in API response');
          return;
        }

        setChartData((prev) => ({
          ...prev,
          series: [
            data.Small?.total || 0,
            data.Large?.total || 0,
            data.ExtraLarge?.total || 0,
            data.Medium?.total || 0
          ]
        }));
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <MainCard title={title}>
      <Grid container spacing={2} direction={onlySM ? 'row' : 'column'}>
        <Grid size={{ xs: 12, sm: 7, md: 12 }}>
          <ReactApexChart {...chartData} type="donut" height={194} />
        </Grid>
        <Grid size={12} sx={{ display: { md: 'block', sm: 'none' } }}>
          <Divider />
        </Grid>
        <Grid size={{ xs: 12, sm: 5, md: 12 }}>
          <Stack
            direction={onlySM ? 'column' : 'row'}
            sx={{ gap: 3, justifyContent: 'space-around', alignItems: 'center' }}
          >
            {bottomData?.map((data, index) => (
              <Stack key={index}>
                <Typography variant="h6">{data.label}</Typography>
                <Typography variant="subtitle1" sx={{ color: data.color }}>
                  {data.value}%
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}

RevenueChartCard.propTypes = {
  title: PropTypes.string,
  bottomData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string
    })
  )
};