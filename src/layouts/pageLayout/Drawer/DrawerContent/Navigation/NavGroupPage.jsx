import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningIcon from '@mui/icons-material/Warning';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import GroupsIcon from '@mui/icons-material/Groups';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DownloadIcon from '@mui/icons-material/Download';
import QRCode from 'qrcode';
// project imports
import NavCollapsePage from './NavCollapsePage';
import NavItemPage from './NavItemPage';

import { useEffect, useState } from "react";
import { lockers as getLockers, lockersCount as getLockersCount } from 'api/auth.api';
import { timeAgo } from 'utils/timeAgo';

export default function NavGroupPage() {
  const [state, setState] = useState('');

  const states = ['Tamil Nadu', 'Kerala', 'Karnataka', 'Delhi'];
  const [searchCity, setSearchCity] = useState("");
  const [lockers, setLockers] = useState([]);
  const [lockersCount, setLockersCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resLockers = await getLockers();
        const data = Array.isArray(resLockers.data)
        ? resLockers.data
        : resLockers.data.data || [];

        // remove duplicates by locker_id
        const uniqueLockers = Array.from(
          new Map(data.map((item) => [item.locker_id, item])).values()
        );

        setLockers(uniqueLockers);

        const resCount = await getLockersCount();
        setLockersCount(resCount.data.data[0].online_count || 0);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredLockers = lockers.filter((option) => {
    const matchStatus =
      statusFilter === "all" || option.overall_status === statusFilter;

    const matchCity =
      option.area?.toLowerCase().includes(searchCity.toLowerCase());

    return matchStatus && matchCity;
  });

  const handleDownload = async (url, fileName) => {
    try {
      // Generate QR from URL
      const qrImage = await QRCode.toDataURL(url);

      // Download
      const link = document.createElement('a');
      link.href = qrImage;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("QR Download Error:", err);
    }
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
            locker
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={(theme) => ({
              ...theme.typography.subMenuCaption,
              color: 'white'
            })} pb={1}
            gutterBottom
          >
            {lockersCount} units online
          </Typography>

          <TextField
            placeholder="Location"
            fullWidth
            variant="outlined"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon sx={{ color: '#ccc',textAlign: 'center' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: '#1C2127',
              // height: 40,
              textAlign: 'center',
              borderRadius: 2,
              '& input': {
                  color: '#fff'
                },

                // ⭐ placeholder color
                '& input::placeholder': {
                  color: '#ccc',
                  opacity: 1
                }
            }} 
          />
          <Grid container spacing={GRID_SPACING} mt={1} pb={3}>
            <Grid size={{ xs: 12, sm: 3, lg: 3 }}>
              <Button onClick={() => setStatusFilter("all")}
                  type="submit"
                  variant="contained"
                  fullWidth sx={{
              backgroundColor: statusFilter === "all" ? "#FF981B" : "#F4F4F41A" ,width: '10',borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                >
                  All
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 3, lg: 3 }}>
              <Button onClick={() => setStatusFilter("healthy")}
                  type="submit"
                  variant="contained"
                  fullWidth sx={{
              backgroundColor: statusFilter === "healthy" ? "#FF981B" : "#F4F4F41A" ,borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                >
                  Healthy
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 3, lg: 3 }}>
              <Button onClick={() => setStatusFilter("warning")}
                  type="submit"
                  variant="contained"
                  fullWidth sx={{
              backgroundColor: statusFilter === "warning" ? "#FF981B" : "#F4F4F41A" ,borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                >
                  Issue
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 3, lg: 3 }}>
              <Button onClick={() => setStatusFilter("critical")}
                  type="submit"
                  variant="contained"
                  fullWidth sx={{
              backgroundColor: statusFilter === "critical" ? "#FF981B" : "#F4F4F41A" ,borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                >
                  Damaged
              </Button>
            </Grid>
          </Grid>
          {filteredLockers.length === 0 ? (
            <Typography
              sx={{
                color: '#8899A6',
                textAlign: 'center',
                mt: 4,
                fontSize: 14
              }}
            >
              No lockers found
            </Typography>
          ) : (
            filteredLockers.map((option) => {
            if (option.overall_status === "healthy") {
            return (  
            <Grid container spacing={GRID_SPACING} mb={3} key={option.locker_id}>
              <Grid size={{ xs: 12, sm: 6, lg: 12 }} sx={{ padding: '10px 10px',borderRadius: 2, backgroundColor: '#102337',border: '1px solid #124376' }}>
                <Grid container spacing={GRID_SPACING}>
                  <Grid size={{ xs: 12, sm: 6, lg: 8 }}>
                    <Typography 
                      sx={(theme) => ({
                        ...theme.typography.subMenuCaption,
                        color: 'white',fontSize: 15
                      })}
                      gutterBottom
                    >
                      {option.locker_code}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Typography 
                      sx={(theme) => ({
                        ...theme.typography.subMenuCaption,
                        color: '#10C085',fontSize: 11, textAlign: 'center',backgroundColor: '#048F6133',padding: '1px 5px', borderRadius: 2
                      })}
                      gutterBottom
                    >
                      {option.overall_status ?? ""}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={GRID_SPACING} mb={1}>
                  <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                    <Typography 
                      sx={(theme) => ({
                        ...theme.typography.subMenuCaption,
                        color: 'white',fontSize: 12
                      })} mb={1}
                      gutterBottom
                    >
                      {option.area}
                    </Typography>
                    {/* <Typography 
                      sx={(theme) => ({
                        ...theme.typography.subMenuCaption,
                        color: 'white',fontSize: 12
                      })}
                      gutterBottom
                    >
                      OCCUPANCY
                    </Typography>
                    <Typography 
                      sx={(theme) => ({
                        ...theme.typography.subMenuCaption,
                        color: 'white',fontSize: 12
                      })}
                      gutterBottom
                    >
                      84%
                    </Typography> */}
                  </Grid>
                  
                </Grid>
                <Grid container spacing={GRID_SPACING}>
                  <Grid size={{ xs: 12, sm: 6, lg: 5 }}>
                    <Typography 
                      sx={(theme) => ({
                        ...theme.typography.subMenuCaption,
                        color: 'white',fontSize: 15
                      })}
                      gutterBottom
                    >
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, lg: 7 }}>
                    <Typography 
                      sx={(theme) => ({
                        ...theme.typography.subMenuCaption,
                        color: '#556473',fontSize: 11
                      })}
                      gutterBottom
                    >
                      Last Sync: {timeAgo(option.logged_at)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Customer List" component="a" href={`/view-customer/${option.locker_id}`}
                          variant="contained"
                          fullWidth sx={{
                      backgroundColor: "transparent" ,border: "1px solid #124376",borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <GroupsIcon />
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Transaction History" component="a" href={`/locker-transaction-list/${option.locker_id}`}
                          variant="contained"
                          fullWidth sx={{ textAlign: 'center',
                      backgroundColor: "transparent" ,border: "1px solid #124376" ,borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <ReceiptIcon />
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Download Qr Code" onClick={() => handleDownload(option.qr_code, option.locker_code)}
                          variant="contained"
                          fullWidth sx={{ textAlign: 'center',
                      backgroundColor: "transparent" ,border: "1px solid #124376" ,borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <DownloadIcon />
                      </Button>
                    </Grid>
                </Grid>
              </Grid>
            </Grid>
            );
            }
            else if (option.overall_status === "warning") {
              return (
              <Grid container spacing={GRID_SPACING} mb={3}>
                <Grid size={{ xs: 12, sm: 6, lg: 12 }} sx={{ padding: '10px 10px',borderRadius: 2, backgroundColor: '#1C2127' }}>
                  <Grid container spacing={GRID_SPACING}>
                    <Grid size={{ xs: 12, sm: 6, lg: 7 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: 'white',fontSize: 15
                        })}
                        gutterBottom
                      >
                        {option.locker_code}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 5 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: '#FAA10A',fontSize: 11, textAlign: 'center',backgroundColor: '#473A2180',padding: '1px 5px', borderRadius: 2
                        })}
                        gutterBottom
                      >
                        Funtional Issue
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={GRID_SPACING} mb={1}>
                    <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: 'white',fontSize: 12
                        })} mb={1}
                        gutterBottom
                      >
                        {option.area}
                      </Typography>
                      {/* <Typography
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.8,
                          color: 'white',
                          fontSize: 11
                        }}
                      >
                        <WarningIcon sx={{ color: '#FFC107', fontSize: 14 }} />
                        Door No 4 Sensor Fault
                      </Typography> */}
                      
                    </Grid>
                    
                  </Grid>
                  <Grid container spacing={GRID_SPACING}>
                    <Grid size={{ xs: 12, sm: 6, lg: 5 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: 'white',fontSize: 15
                        })}
                        gutterBottom
                      >
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 7 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: '#556473',fontSize: 11
                        })}
                        gutterBottom
                      >
                        Last Sync: {timeAgo(option.logged_at)}
                      </Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Customer List" component="a" href={`/view-customer/${option.locker_id}`}
                          variant="contained"
                          fullWidth sx={{
                      backgroundColor: "transparent" ,border: "1px solid #124376",borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <GroupsIcon />
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Transaction History" component="a" href={`/locker-transaction-list/${option.locker_id}`}
                          variant="contained"
                          fullWidth sx={{ textAlign: 'center',
                      backgroundColor: "transparent" ,border: "1px solid #124376" ,borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <ReceiptIcon />
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Download Qr Code" onClick={() => handleDownload(option.qr_code, option.locker_code)}
                          variant="contained"
                          fullWidth sx={{ textAlign: 'center',
                      backgroundColor: "transparent" ,border: "1px solid #124376" ,borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <DownloadIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              );
            }else if (option.overall_status === "critical") {
              return (
              <Grid container spacing={GRID_SPACING} mb={3}>
                <Grid size={{ xs: 12, sm: 6, lg: 12 }} sx={{ padding: '10px 10px',borderRadius: 2, backgroundColor: '#1C2127' }}>
                  <Grid container spacing={GRID_SPACING}>
                    <Grid size={{ xs: 12, sm: 6, lg: 7 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: 'white',fontSize: 15
                        })}
                        gutterBottom
                      >
                        {option.locker_code}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 5 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: '#E44242',fontSize: 11, textAlign: 'center',backgroundColor: '#46282D80',padding: '1px 5px', borderRadius: 2
                        })}
                        gutterBottom
                      >
                        Damaged
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={GRID_SPACING} mb={1}>
                    <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: 'white',fontSize: 12
                        })} mb={1}
                        gutterBottom
                      >
                        {option.area}
                      </Typography>
                      
                      {/* <Typography
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.8,
                          color: '#E44242',
                          fontSize: 11
                        }}
                      >
                        <DoNotDisturbIcon sx={{ color: '#E44242', fontSize: 14 }} />
                        Vandalism Detached
                      </Typography> */}
                    </Grid>
                    
                  </Grid>
                  <Grid container spacing={GRID_SPACING}>
                    <Grid size={{ xs: 12, sm: 6, lg: 5 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: 'white',fontSize: 15
                        })}
                        gutterBottom
                      >
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 7 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: '#E44242',fontSize: 11
                        })}
                        gutterBottom
                      >
                        Alert: {timeAgo(option.logged_at)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Customer List" component="a" href={`/view-customer/${option.locker_id}`}
                          variant="contained"
                          fullWidth sx={{
                      backgroundColor: "transparent" ,border: "1px solid #124376",borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <GroupsIcon />
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Transaction History" component="a" href={`/locker-transaction-list/${option.locker_id}`}
                          variant="contained"
                          fullWidth sx={{ textAlign: 'center',
                      backgroundColor: "transparent" ,border: "1px solid #124376" ,borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <ReceiptIcon />
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Download Qr Code" onClick={() => handleDownload(option.qr_code, option.locker_code)}
                          variant="contained"
                          fullWidth sx={{ textAlign: 'center',
                      backgroundColor: "transparent" ,border: "1px solid #124376" ,borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <DownloadIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              );
            }else if (option.overall_status === 'new') {
              return (  
              <Grid container spacing={GRID_SPACING} mb={3} key={option.locker_id}>
                <Grid size={{ xs: 12, sm: 6, lg: 12 }} sx={{ padding: '10px 10px',borderRadius: 2, backgroundColor: '#102337',border: '1px solid #124376' }}>
                  <Grid container spacing={GRID_SPACING}>
                    <Grid size={{ xs: 12, sm: 6, lg: 8 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: 'white',fontSize: 15
                        })}
                        gutterBottom
                      >
                        {option.locker_code}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: '#ebfa20',fontSize: 11, textAlign: 'center',backgroundColor: '#048F6133',padding: '1px 5px', borderRadius: 2
                        })}
                        gutterBottom
                      >
                        New
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={GRID_SPACING} mb={1}>
                    <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                      <Typography 
                        sx={(theme) => ({
                          ...theme.typography.subMenuCaption,
                          color: 'white',fontSize: 12
                        })} mb={1}
                        gutterBottom
                      >
                        {option.area}
                      </Typography>
                      
                    </Grid>
                    
                  </Grid>
                  <Grid container spacing={GRID_SPACING}>
                    
                    <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Customer List" component="a" href={`/view-customer/${option.locker_id}`}
                          variant="contained"
                          fullWidth sx={{
                      backgroundColor: "transparent" ,border: "1px solid #124376",borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <GroupsIcon />
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Transaction History" component="a" href={`/locker-transaction-list/${option.locker_id}`}
                          variant="contained"
                          fullWidth sx={{ textAlign: 'center',
                      backgroundColor: "transparent" ,border: "1px solid #124376" ,borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <ReceiptIcon />
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3, lg: 4 }}>
                      <Button title="Download Qr Code" onClick={() => handleDownload(option.qr_code, option.locker_code)}
                          variant="contained"
                          fullWidth sx={{ textAlign: 'center',
                      backgroundColor: "transparent" ,border: "1px solid #124376" ,borderRadius: 2, textTransform: 'capitalize',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
                        >
                          <DownloadIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              );
            }
            })
          )}
          
            <Grid container spacing={GRID_SPACING} pt={5}>
            <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
              <Button
                type="submit"
                variant="contained"
                component="a"
                href="/locker-add"
                fullWidth
                startIcon={<AddIcon />}   // 👈 icon here
                sx={{
                  
                  backgroundColor: '#FF981B',
                  borderRadius: 2,
                  textTransform: 'capitalize',
                  fontSize: 15,
                  color: 'white',
                  '&:hover': { backgroundColor: '#FF981B' }
                }}
              >
                Deploy New Unit
              </Button>
            </Grid>
          </Grid>
          
        </Box>
      
  );
}

