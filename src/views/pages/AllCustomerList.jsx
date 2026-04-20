// material-ui
import * as React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { customerAllList, userDelete } from '../../api/auth.api';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from "@mui/material";

// project imports
import MainCard from 'components/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  const [usersData, setUsersData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try { 
        const res = await customerAllList();
       
        const data =
          res?.data?.data ||
          res?.data ||
          (Array.isArray(res) ? res : []);
        const csvdata = data.map((user) => ({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_no: user.phone_no,
          flat_no: user.flat_no,
          locker_code: user.locker_code
        }));
        
        setUsersData(data);
        setCsvData(csvdata);
        
      } catch (error) {
        console.error("Customers fetch error:", error);
      }
    };

    fetchUsers();
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("first_name");

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const [filters, setFilters] = useState({
    locker: '',
    building: '',
    floor: '',
    flat: '',
    status: ''
  }); 

  const sortedRows = React.useMemo(() => {
      return usersData
        .filter(row => {
          // Filter by dropdowns
          const matchesFilters =
          (!filters.building || row.building_no === filters.building) &&
          (!filters.floor || row.floor_no === filters.floor) &&
          (!filters.locker || row.locker_code === filters.locker) &&
          (!filters.flat || row.flat_no === filters.flat);
  
          // Filter by search text safely
          const matchesSearch =
          !searchText ||
          (row.first_name && row.first_name.toLowerCase().includes(searchText.toLowerCase())) ||
          (row.last_name && row.last_name.toLowerCase().includes(searchText.toLowerCase())) ||
          (row.email && row.email.toLowerCase().includes(searchText.toLowerCase())) ||
          (row.phone_no && row.phone_no.toString().includes(searchText)) ||
          (row.flat_no && row.flat_no.toString().includes(searchText)) ||
          (row.floor_no && row.floor_no.toString().includes(searchText)) ||
          (row.locker_code && row.locker_code.toString().includes(searchText)) ||
          (row.building_no && row.building_no.toString().includes(searchText));
            
          return matchesFilters && matchesSearch;
        })
        .sort((a, b) => {
          if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
          if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
          return 0;
        });
    }, [usersData, filters, searchText, order, orderBy]);

  const lockerFilteredData = React.useMemo(() => {
    if (!filters.locker) return usersData;

    return usersData.filter(
      (row) => row.locker_code === filters.locker
    );
  }, [usersData, filters.locker]);

  const exportCSV = (data) => {

    if (!data || data.length === 0) return;

    const columns = [
      { key: "first_name", header: "First Name" },
      { key: "last_name", header: "Last Name" },
      { key: "email", header: "Email" },
      { key: "phone_no", header: "Mobile No" },
      { key: "flat_no", header: "Flat No" },
      { key: "locker_code", header: "Locker No" },
    ];

    const headers = columns.map(col => col.header);

    const csvRows = [
      headers.join(","),
      ...data.map(row =>
        columns.map(col => JSON.stringify(row[col.key] ?? "")).join(",")
      )
    ];

    const csvString = csvRows.join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "all-customer-list.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Box>
        
        <Grid container spacing={GRID_SPACING}>
          <Grid size={{ xs: 12, sm: 6, lg: 12 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center',border:'none' }}>
            <TextField
              placeholder="Quick Search"
              fullWidth
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#666666',textAlign: 'center' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: '#E2E2E2',
                border:'none !important',
                textAlign: 'center',
                marginBottom: -8,
                marginTop: -2,
                borderRadius: 2,
                '& input': {
                    color: '#666666',
                    border:'none',
                  },

                  // ⭐ placeholder color
                  '& input::placeholder': {
                    color: '#666666',
                    opacity: 1,
                    border:'none',
                  }
              }} 
            />
          </Grid>  
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ padding: '10px 10px',borderRadius: 2 }}>
             <Typography color="text.primary" gutterBottom variant="h4">
                All Customer List
              </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
            <TextField
              select
              size="small"
              value={filters.locker}
              onChange={(e) => {
                setFilters({
                  locker: e.target.value,
                  flat: '',
                  building: '',
                  floor: ''
                });
                setPage(0);
              }}
              fullWidth
              SelectProps={{ displayEmpty: true }}
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                '& .MuiSelect-select': {
                    color: 'black',
                    fontSize: 13
                  },
  
                  // icon color
                  '& .MuiSvgIcon-root': {
                    color: 'black',
                    fontSize: 13
                  }
              }}
            >
            <MenuItem value="" disabled>
              Locker No
            </MenuItem>
            
            {[...new Set(lockerFilteredData.map(item => item.locker_code))].map((flatNo) => (
              <MenuItem key={flatNo} value={flatNo} sx={{ textTransform: 'capitalize' }}>
                {flatNo}
              </MenuItem>
            ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
            <TextField
              select
              size="small"
              value={filters.flat}
              onChange={(e) => {
                setFilters({ ...filters, flat: e.target.value });
                setPage(0);
              }}
              fullWidth
              SelectProps={{ displayEmpty: true }}
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                '& .MuiSelect-select': {
                    color: 'black',
                    fontSize: 13
                  },
  
                  // icon color
                  '& .MuiSvgIcon-root': {
                    color: 'black',
                    fontSize: 13
                  }
              }}
            >
            <MenuItem value="" disabled>
              Flat No
            </MenuItem>
            
            {[...new Set(lockerFilteredData.map(item => item.flat_no))].map((flatNo) => (
              <MenuItem key={flatNo} value={flatNo} sx={{ textTransform: 'capitalize' }}>
                {flatNo}
              </MenuItem>
            ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center',colo:'black' }}>
            <TextField
              select
              size="small"
              value={filters.building}
              onChange={(e) => {
                setFilters({ ...filters, building: e.target.value });
                setPage(0);
              }}
              fullWidth
              SelectProps={{ displayEmpty: true }}
              sx={{
                backgroundColor: '#fff',
                color:'#000',
                borderRadius: 2,
                '& .MuiSelect-select': {
                    color: 'black',
                    fontSize: 13
                  },
  
                  // icon color
                  '& .MuiSvgIcon-root': {
                    color: 'black',
                    fontSize: 13
                  }
              }}
            >
            <MenuItem value="" disabled>
              Building No
            </MenuItem>
            
            {[...new Set(lockerFilteredData.map(item => item.building_no))].map((flatNo) => (
              <MenuItem key={flatNo} value={flatNo} sx={{ textTransform: 'capitalize' }}>
                {flatNo}
              </MenuItem>
            ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center',colo:'black' }}>
            <TextField
              select
              size="small"
              value={filters.floor}
              onChange={(e) => {
                setFilters({ ...filters, floor: e.target.value });
                setPage(0);
              }}
              fullWidth
              SelectProps={{ displayEmpty: true }}
              sx={{
                backgroundColor: '#fff',
                color:'#000',
                borderRadius: 2,
                '& .MuiSelect-select': {
                    color: 'black',
                    fontSize: 13
                  },
  
                  // icon color
                  '& .MuiSvgIcon-root': {
                    color: 'black',
                    fontSize: 13
                  }
              }}
            >
            <MenuItem value="" disabled>
              Floor No
            </MenuItem>
            
            {[...new Set(lockerFilteredData.map(item => item.floor_no))].map((flatNo) => (
              <MenuItem key={flatNo} value={flatNo} sx={{ textTransform: 'capitalize' }}>
                {flatNo}
              </MenuItem>
            ))}
            </TextField>
          </Grid>
                    
          <Grid size={{ xs: 12, sm: 6, lg: 1 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
            <Button onClick={() => exportCSV(csvData)}
                type="submit"
                variant="contained"
                fullWidth sx={{
            backgroundColor: '#FF981B' ,borderRadius: 1, textTransform: 'uppercase',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
              >
                export
            </Button>
          </Grid>
        </Grid>
        <MainCard>
          <Grid container spacing={GRID_SPACING}>
            <Grid size={{ xs: 12, sm: 6, lg: 12 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{
                          borderBottom: "1px solid #A7A7A7"
                        }}>
                          <TableCell>Locker No</TableCell>
                          <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Floor No</TableCell>
                            <TableCell>Building No</TableCell>
                            <TableCell>Flat No</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {sortedRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No Data Found
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedRows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, i) => (
                            <TableRow key={i} hover>
                              <TableCell>{row.locker_code}</TableCell>
                              <TableCell>{row.first_name}</TableCell>
                              <TableCell>{row.last_name}</TableCell>
                              <TableCell>{row.email}</TableCell>
                              <TableCell>{row.phone_no}</TableCell>
                              <TableCell>{row.floor_no}</TableCell>
                              <TableCell>{row.building_no}</TableCell>
                              <TableCell>{row.flat_no}</TableCell>
                              
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={sortedRows.length} 
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(+e.target.value);
                    setPage(0);
                  }}
                />
            </Grid>  
              
          </Grid>
          
        </MainCard>
    </Box>
  );
}
