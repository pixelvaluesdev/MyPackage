// material-ui
import Typography from '@mui/material/Typography';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { lockers as getLockers, lockersCount as getLockersCount } from 'api/auth.api';
// project imports
import MainCard from 'components/cards/MainCard';

const icon = (color) =>
  new L.DivIcon({
    html: `<div style="
      width:12px;
      height:12px;
      background:${color};
      "></div>`
  });
// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  const [lockers, setLockers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resLockers = await getLockers();
        setLockers(Array.isArray(resLockers.data) ? resLockers.data : resLockers.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const points = lockers.map((locker) => ({
    lat: locker.latitude,     // adjust field name based on API
    lng: locker.longitude,    // adjust field name based on API
    status: locker.overall_status,
    locker_code: locker.locker_code,
    color:
      locker.overall_status === "healthy"
        ? "green"
        : locker.overall_status === "warning"
        ? "orange"
        : locker.overall_status === "new"
        ? "blue"
        : "red",
  }));
  return (
    <Box sx={{ height: 580, borderRadius: 2, overflow: 'hidden' }}>
      <MapContainer center={points.length ? [points[0].lat, points[0].lng] : [21.1458, 79.0882]} zoom={14} style={{ height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {points.map((p) => (
          <Marker key={p.locker_code} position={[p.lat, p.lng]} icon={icon(p.color)}>
            <Popup>
              {p.locker_code} <br /> 
              {/* {p.status} */}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      
      <Box sx={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        bgcolor: '#1C2127CC',
        color: '#fff',
        p: 1.5,
        borderRadius: 2,
        fontSize: 12,
        zIndex:999,
        border: 'none'
      }}>
        Status<br/>
        🔵 New <br/>
        🟢 Healthy <br/>
        🟠 Functional Issue <br/>
        🔴 Damaged
      </Box>
      
    </Box>
  );
}
