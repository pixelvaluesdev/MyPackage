// material-ui
import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { dashboardFilter, dashboard } from '../../../api/auth.api';
import MainCard from 'components/cards/MainCard';

// project imports
import TrafficSourceCard from 'components/cards/TrafficSourceCard';
import RevenuChartCard from 'components/third-party/RevenuChartCard';
import { GRID_SPACING } from 'config';
import truck from 'assets/images/truck.png';
import locker from 'assets/images/locker.png';
import clock from 'assets/images/clock.png';
import percent from 'assets/images/percent.png';
import footfall from 'assets/images/footfall.png';
// data
import { revenueCardData } from 'sections/dashboard/chart/card-data/revenue-card-data';
import { trafficSourceData } from './data/traffic-source-card-data';
import { useLocation, useParams } from "react-router-dom";

// const dataLine = [
//   { date: "1-5 Jan", green: 16, orange: 12, red: 13 },
//   { date: "6-10 Jan", green: 11, orange: 9, red: 10 },
//   { date: "11-15 Jan", green: 13, orange: 12, red: 15 },
//   { date: "16-20 Jan", green: 11, orange: 7, red: 6 },
//   { date: "21-25 Jan", green: 11, orange: 16, red: 14 },
//   { date: "25-31 Jan", green: 17, orange: 10, red: 8 }
// ];



const COLORS = [
  "#f7931e",
  "#4f83cc",
  "#00acc1",
  "#7cb342",
  "#1565c0",
  "#e53935"
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div
        style={{
          background: "#fff",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}
      >
        <div>Percentage: {item.value}%</div>
        <div>Time: {item.name}</div>
      </div>
    );
  }
  return null;
};
// ==============================|| DASHBOARD DEFAULT ||============================== //

export default function Default() {

  const [activeChart, setActiveChart] = useState('compartment');
  const [dashboardData, setDashboardData] = useState(null);
  
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const cleanState = params.get("state") || "";
  const cleanCity = params.get("city") || "";
  const cleanArea = params.get("area") || "";
  const cleanPeriod = params.get("period") || "";

  useEffect(() => {
    const fetchData = async () => {
      setDashboardData(null);
      const hasFilter =
        cleanState !== "" ||
        cleanCity !== "" ||
        cleanArea !== "" ||
        cleanPeriod !== "";

      const res = hasFilter
        ? await dashboardFilter(15, cleanState, cleanCity, cleanArea, cleanPeriod)
        : await dashboard(15);

      setDashboardData(res.data.data);
    };

    fetchData();
  }, [location.search]);

  const occupancyChartData =
  dashboardData?.occupancyOverTime?.length > 0
    ? dashboardData.occupancyOverTime.map((item) => ({
        date: item.range_label,
        occupancy: Number(item.occupancy || 0)
      }))
    : [];
    
  const data =
  dashboardData?.customerPickupTime?.length > 0
    ? dashboardData.customerPickupTime.map((item) => ({
        name: item.time_range,
        value: item.total
      }))
    : [];
 
  return (
    <Box key={location.search}>
    <Typography
      sx={{
        color: 'black',
        fontSize: 25,
        fontWeight: 600,
        textTransform: 'capitalize',
        marginTop: -3,
        marginBottom: 2
      }}
      
    >
      Analytics Dashboard
    </Typography>
    
    <Grid container spacing={GRID_SPACING}>
      
      <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 0.15, p: 2,height:'100px'}}>
        <Stack direction="column" sx={{  alignItems: 'flex-start', justifyContent: 'space-between' , gap: GRID_SPACING }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 30,
                height: 30,
                backgroundColor: '#FF981B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1
              }}
            >
              <Box
                component="img"
                src={truck}
                alt="truck-icon"
                sx={{ width: 18 }}
              />
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600,fontSize: 12 }}>
              Total Deliveries
            </Typography>
          </Stack>
          <Typography variant="" sx={{ color: 'black',fontWeight: 600,fontSize: 20,marginTop: -2 }}>
            {dashboardData?.deliveriesTotal || 0}
          </Typography>

        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 0.15, p: 2,height:'100px'}}>
        <Stack direction="column" sx={{  alignItems: 'flex-start', justifyContent: 'space-between' , gap: GRID_SPACING }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 30,
                height: 30,
                backgroundColor: '#FF981B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1
              }}
            >
              <Box
                component="img"
                src={locker}
                alt="truck-icon"
                sx={{ width: 18 }}
              />
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600,fontSize: 12 }}>
              Total Lockers
            </Typography>
          </Stack>
          <Typography variant="h4" sx={{ color: 'black',fontWeight: 600,fontSize: 20,marginTop: -2 }}>
            {dashboardData?.activeLockerTotal ?? 0}
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 0.15, p: 2,height:'100px'}}>
        <Stack direction="column" sx={{  alignItems: 'flex-start', justifyContent: 'space-between' , gap: GRID_SPACING }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 30,
                height: 30,
                backgroundColor: '#FF981B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1
              }}
            >
              <Box
                component="img"
                src={clock}
                alt="truck-icon"
                sx={{ width: 18 }}
              />
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600,fontSize: 12 }}>
              Avg Pickup Time
            </Typography>
          </Stack>

          {/* <Typography variant="" sx={{ color: 'black',fontWeight: 400,fontSize: 13 }}>
            Avg Pickup Time
          </Typography> */}

          <Typography variant="h4" sx={{ color: 'black',fontWeight: 600,fontSize: 20,marginTop: -2 }}>
            {dashboardData?.avgPickupTime ?? 0} hrs
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 0.15, p: 2,height:'100px'}}>
        <Stack direction="column" sx={{  alignItems: 'flex-start', justifyContent: 'space-between' , gap: GRID_SPACING }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 30,
                height: 30,
                backgroundColor: '#FF981B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1
              }}
            >
              <Box
                component="img"
                src={percent}
                alt="truck-icon"
                sx={{ width: 18 }}
              />
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600,fontSize: 12 }}>
              Occupency Rate
            </Typography>
          </Stack>

          {/* <Typography variant="" sx={{ color: 'black',fontWeight: 400,fontSize: 13 }}>
            Occupency Rate
          </Typography> */}

          <Typography variant="h4" sx={{ color: 'black',fontWeight: 600,fontSize: 20,marginTop: -2 }}>
            {dashboardData?.occupancyRate ?? 0}
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 0.15, p: 2,height:'100px'}}>
        <Stack direction="column" sx={{  alignItems: 'flex-start', justifyContent: 'space-between' , gap: GRID_SPACING }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 30,
                height: 30,
                backgroundColor: '#FF981B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1
              }}
            >
              <Box
                component="img"
                src={footfall}
                alt="truck-icon"
                sx={{ width: 18 }}
              />
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600,fontSize: 12 }}>
              Footfall
            </Typography>
          </Stack>

          {/* <Typography sx={{ color: 'black', fontWeight: 400,fontSize: 13, marginTop: -2 }}>
            Footfall
          </Typography> */}

          <Typography sx={{ color: 'black', fontWeight: 600,fontSize: 20, marginTop: -2 }}>
            {dashboardData?.footFallTotal || 0}
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 0.15, p: 2,height:'100px'}}>
        <Stack direction="column" sx={{  alignItems: 'flex-start', justifyContent: 'space-between' , gap: GRID_SPACING }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 30,
                height: 30,
                backgroundColor: '#FF981B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1
              }}
            >
              <Box
                component="img"
                src={footfall}
                alt="truck-icon"
                sx={{ width: 18 }}
              />
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600,fontSize: 12 }}>
              Customers Count
            </Typography>
          </Stack>

          {/* <Typography sx={{ color: 'black', fontWeight: 400,fontSize: 13, marginTop: -2 }}>
            Footfall
          </Typography> */}

          <Typography sx={{ color: 'black', fontWeight: 600,fontSize: 20, marginTop: -2 }}>
            {dashboardData?.activeCustomers || 0}
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Button
            type="submit"
            variant="contained"
            fullWidth 
            onClick={() => setActiveChart('compartment')}
            sx={{
        backgroundColor: activeChart === 'compartment' ? '#FF981B' : '#D9D9D9' ,borderRadius: 1.5, textTransform: 'capitalize',fontSize: 12, color: activeChart === 'compartment' ? 'white' : 'black',padding: '10px', '&:hover': { backgroundColor: '#FF981B' }}}
          >
            Compartment Size Occupancy
        </Button>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Button
            type="submit"
            variant="contained"
            fullWidth 
            onClick={() => setActiveChart('vendor')}
            sx={{
        backgroundColor: activeChart === 'vendor' ? '#FF981B' : '#D9D9D9' ,borderRadius: 1.5, textTransform: 'capitalize',fontSize: 12, color: activeChart === 'vendor' ? 'white' : 'black',padding: '10px', '&:hover': { backgroundColor: '#FF981B' }}}
          >
            Vendor Comparison
        </Button>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Button
            type="submit"
            variant="contained"
            fullWidth 
            onClick={() => setActiveChart('customer_pickup')}
            sx={{
        backgroundColor: activeChart === 'customer_pickup' ? '#FF981B' : '#D9D9D9' ,borderRadius: 1.5, textTransform: 'capitalize',fontSize: 12, color: activeChart === 'customer_pickup' ? 'white' : 'black',padding: '10px', '&:hover': { backgroundColor: '#FF981B' }}}
          >
            Customer pickup time pie chart
        </Button>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
        <Button
            type="submit"
            variant="contained"
            fullWidth 
            sx={{
        backgroundColor: '#D9D9D9' ,borderRadius: 1.5, textTransform: 'capitalize',fontSize: 12, color: 'black',padding: '10px', '&:hover': { backgroundColor: '#FF981B' }}}
          >
            Peak pickup heatmap
        </Button>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
        <Button
            type="submit"
            variant="contained"
            fullWidth 
            onClick={() => setActiveChart('ocuupency_overtime')}
            sx={{
        backgroundColor: activeChart === 'ocuupency_overtime' ? '#FF981B' : '#D9D9D9' ,borderRadius: 1.5, textTransform: 'capitalize',fontSize: 12, color: activeChart === 'ocuupency_overtime' ? 'white' : 'black',padding: '10px', '&:hover': { backgroundColor: '#FF981B' }}}
          >
            Occupancy over time
        </Button>
      </Grid>
      {activeChart === 'compartment' && (
        <Grid size={{ xs: 12, sm: 6, lg: 8 }}>
          <RevenuChartCard {...revenueCardData} />
        </Grid>
      )}
      {activeChart === 'vendor' && (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TrafficSourceCard {...trafficSourceData} />
        </Grid>
      )}
      {activeChart === 'customer_pickup' && (
        <Grid size={{ xs: 12, sm: 6, lg: 8 }}>
          <MainCard title="Customer pickup time Pie chart">
              
            <Stack sx={{ gap: 1 }}>
              <div style={{ width: 400, height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    outerRadius={110}
                    innerRadius={0}
                  >
                    {data.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            </Stack>
              
          </MainCard>
        </Grid>
      )}
      {activeChart === 'ocuupency_overtime' && (
        // <Grid size={{ xs: 12, sm: 6, lg: 8 }}>
        //   <MainCard title="Occupancy over time">
              
        //     <Stack sx={{ gap: 1 }}>
        //        <div style={{ width: "100%", height: 400 }}>
        //         <ResponsiveContainer>
        //           <LineChart data={dataLine}>
        //             <CartesianGrid strokeDasharray="3 3" />

        //             <XAxis dataKey="date" />

        //             <YAxis
        //               domain={[6, 21]}
        //               tickFormatter={(t) => `${t}:00`}
        //             />

        //             <Tooltip />

        //             <Legend />

        //             <Line
        //               type="linear"
        //               dataKey="green"
        //               stroke="#1b5e20"
        //               strokeWidth={1.5}
        //               dot={{ r: 4 }}
        //             />

        //             <Line
        //               type="linear"
        //               dataKey="orange"
        //               stroke="#f7931e"
        //               strokeWidth={1.5}
        //               dot={{ r: 4 }}
        //             />

        //             <Line
        //               type="linear"
        //               dataKey="red"
        //               stroke="#e53935"
        //               strokeWidth={1.5}
        //               dot={{ r: 4 }}
        //             />
        //           </LineChart>
        //         </ResponsiveContainer>
        //       </div>
        //     </Stack>
              
        //   </MainCard>
        // </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 8 }}>
          <MainCard title="Occupancy over time">
              
            <Stack sx={{ gap: 1 }}>
               <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={occupancyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis allowDecimals={false} />

                    <Tooltip
                      formatter={(value) => [`${value}`, 'Occupancy']}
                      labelFormatter={(label) => `Range: ${label}`}
                    />

                    <Legend />

                    <Line
                      type="linear"
                      dataKey="occupancy"
                      stroke="#1b5e20"
                      strokeWidth={1.5}
                      dot={{ r: 4 }}
                    />

                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Stack>
              
          </MainCard>
        </Grid>
      )}
    </Grid>
  </Box>  
  );
}
