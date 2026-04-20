// material-ui
import * as React from "react";
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';
import Stack from '@mui/material/Stack';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuItem from '@mui/material/MenuItem';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper
} from "@mui/material";

// project imports
import MainCard from 'components/cards/MainCard';

import visulize_logo from 'assets/images/visulize_logo.png';
import analytics_logo from 'assets/images/analytics_logo.png';
import analytics from 'assets/images/analytics.jpg';
import map from 'assets/images/map.jpg';
// ==============================|| SAMPLE PAGE ||============================== //

const rowsData = [
  { Order_Id: "486569", First_Name: "amit", Last_Name: "fcfgvg", Building_No: 101,Floor_No: 101,Flat_No: 101,Order_Date: "23/8/2023",Received: 'Yes',Canclled: '-' },
  { Order_Id: "486569", First_Name: "rahul", Last_Name: "vghgv",Building_No: 101,Floor_No: 101,Flat_No: 101,Order_Date: "23/8/2023",Received: 'Yes',Canclled: '-' },
  { Order_Id: "486569", First_Name: "sneha", Last_Name: "xcvg",Building_No: 101 ,Floor_No: 101,Flat_No: 101,Order_Date: "23/8/2023",Received: 'Yes',Canclled: '-'},
  { Order_Id: "486569", First_Name: "priya", Last_Name: "cgfvgbh",Building_No: 101,Floor_No: 101,Flat_No: 101,Order_Date: "23/8/2023",Received: 'Yes',Canclled: '-' },
  { Order_Id: "486569", First_Name: "vikram", Last_Name: "cfvgb",Building_No: 101,Floor_No: 101,Flat_No: 101,Order_Date: "23/8/2023",Received: 'Yes',Canclled: '-' },
  { Order_Id: "486569", First_Name: "neha", Last_Name: "vgbh",Building_No: 101,Floor_No: 101,Flat_No: 101,Order_Date: "23/8/2023",Received: 'Yes',Canclled: '-' },
  { Order_Id: "486569", First_Name: "karan", Last_Name: "drtfg",Building_No: 101,Floor_No: 101,Flat_No: 101 ,Order_Date: "23/8/2023",Received: 'Yes',Canclled: '-'},
  { Order_Id: "486569", First_Name: "riya", Last_Name: "trftyg",Building_No: 101,Floor_No: 101,Flat_No: 101 ,Order_Date: "23/8/2023",Received: 'Yes',Canclled: '-'}
];

const columns = [
  { id: "Order Id", label: "Order Id" },
  { id: "First_Name", label: "First Name" },
  { id: "Last_Name", label: "Last Name" },
  { id: "Building_No", label: "Building No" },
  { id: "Floor_No", label: "Floor No" },
  { id: "Flat_No", label: "Flat No" },
  { id: "Order_Date", label: "Order Date" },
  { id: "Received", label: "Received" },
  { id: "Canclled", label: "Canclled" },
];

export default function SamplePage() {
 
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("First_Name");

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    return [...rowsData].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [order, orderBy]);

  return (
    <Box>
        <Grid container spacing={GRID_SPACING} sx={{ margin: '4.5% 0'}} justifyContent="center">
            <Grid size={{ xs: 12, sm: 6, lg: 3}}></Grid>
            
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 0.15, p: 2}}>
                <Stack direction="column" sx={{  alignItems: 'center', justifyContent: 'space-between' , gap: 1 }}>
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
                        src={visulize_logo}
                        alt="truck-icon"
                        sx={{ width: 18 }}
                    />
                    </Box>

                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 600,fontSize: 15 }}>
                Visualize
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 400,fontSize: 13,textAlign:'center' }}>
                explore India-wide locker locations and real-time geographical status 
                </Typography>
                <IconButton size="small">
                <CardMedia component="img" image={map} alt="profile" sx={{ borderRadius: '5px' }} />
                </IconButton>
                <Button
                    type="submit"
                    variant="contained"
                    component='a'
                    href="/visualize"
                    fullWidth
                    sx={{
                    backgroundColor: '#FF981B',
                    borderRadius: 2,
                    textTransform: 'capitalize',
                    fontSize: 15,
                    color: 'white',
                    '&:hover': { backgroundColor: '#FF981B' }
                    }}
                >
                    Enter Map View   <ArrowForwardIcon />
                </Button>
                </Stack>
            </Grid>
            
            {localStorage.getItem('user_role') === 'admin' && (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 0.15, p: 2}}>
                <Stack direction="column" sx={{  alignItems: 'center', justifyContent: 'space-between' , gap: 1 }}>
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
                        src={analytics_logo}
                        alt="truck-icon"
                        sx={{ width: 18 }}
                    />
                    </Box>

                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 600,fontSize: 15 }}>
                Analytics 
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 400,fontSize: 13,textAlign:'center' }}>
                Monitor performance matrices, usage trends and operational health  
                </Typography>
                <IconButton size="small">
                <CardMedia component="img" image={analytics} alt="profile" sx={{ borderRadius: '5px' }} />
                </IconButton>
                <Button
                    type="submit"
                    variant="contained"
                    component='a'
                    href="/analytics"
                    fullWidth
                    sx={{
                    backgroundColor: '#FF981B',
                    borderRadius: 2,
                    textTransform: 'capitalize',
                    fontSize: 15,
                    color: 'white',
                    '&:hover': { backgroundColor: '#FF981B' }
                    }}
                >
                    View Insights   <ArrowForwardIcon />
                </Button>
                </Stack>
            </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6, lg: 3}}></Grid>
        </Grid>
    </Box>
  );
}
