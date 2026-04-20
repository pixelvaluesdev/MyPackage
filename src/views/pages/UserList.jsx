// material-ui
import * as React from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from "react";
import { users, userDelete } from '../../api/auth.api';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
  Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// project imports
import MainCard from 'components/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [usersData, setUsersData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try { 
        const res = await users();
        const data = res?.data?.data || [];
        const csvdata = data.map((user) => ({
          usr_name: user.usr_name,
          usr_last_name: user.usr_last_name,
          usr_email: user.usr_email,
          mobile_no: user.mobile_no
        }));
        setUsersData(data);
        setCsvData(csvdata);
      } catch (error) {
        console.error("Users fetch error:", error);
      }
    };

    fetchUsers();
  }, []);


  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("usr_name");

  const handleEdit = (row) => {
    console.log("Edit:", row);
  };

  const handleDelete = async (user_id) => {
    try {

      const confirmDelete = window.confirm(
        "Are you sure you want to delete?"
      );

      if (!confirmDelete) return;

      await userDelete(user_id);

      setSnackbar({
        open: true,
        message: "User deleted successfully!",
        severity: "success"
      });

      // Refresh list immediately
      fetchUsers();

    } catch (error) {

      console.error("Delete error:", error);

      setSnackbar({
        open: true,
        message: "Delete failed!",
        severity: "error"
      });

    }
  };
  
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const [filters, setFilters] = useState({
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
            (!filters.flat || row.flat_no === filters.flat)
  
          // Filter by search text safely
          const matchesSearch =
            !searchText ||
            (row.usr_name?.toLowerCase().includes(searchText.toLowerCase())) ||
            (row.usr_last_name?.toLowerCase().includes(searchText.toLowerCase())) ||
            (row.usr_email?.toLowerCase().includes(searchText.toLowerCase())) ||
            (row.mobile_no?.toString().includes(searchText));
          return matchesFilters && matchesSearch;
        })
        .sort((a, b) => {
          if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
          if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
          return 0;
        });
    }, [usersData, filters, searchText, order, orderBy]);

  const exportCSV = (data) => {

    if (!data || data.length === 0) return;

    const columns = [
      { key: "usr_name", header: "First Name" },
      { key: "usr_last_name", header: "Last Name" },
      { key: "usr_email", header: "Email" },
      { key: "mobile_no", header: "Mobile No" }
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
    link.download = "user-list.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
           
          <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
            {/* <TextField
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
            
            {[...new Set(usersData.map(item => item.flat_no))].map((flatNo) => (
              <MenuItem key={flatNo} value={flatNo} sx={{ textTransform: 'capitalize' }}>
                {flatNo}
              </MenuItem>
            ))}
            </TextField> */}
            <Typography color="text.primary" gutterBottom variant="h4">
              Admin User List
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center',colo:'black' }}>
            {/* <TextField
              select
              size="small"
              value={list}
              onChange={(e) => setList(e.target.value)}
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
            
            {lists.map((option) => (
              <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                {option}
              </MenuItem>
            ))}
            </TextField> */}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
            {/* <TextField
              select
              size="small"
              value={list}
              onChange={(e) => setList(e.target.value)}
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
              Received
            </MenuItem>
            
            {lists.map((option) => (
              <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                {option}
              </MenuItem>
            ))}
            </TextField> */}
          </Grid> 
          <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
            
            {/* <TextField
              select
              size="small"
              value={list}
              onChange={(e) => setList(e.target.value)}
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
              Cancelled
            </MenuItem>
            
            {lists.map((option) => (
              <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                {option}
              </MenuItem>
            ))}
            </TextField> */}
          </Grid> 
          <Grid size={{ xs: 12, sm: 6, lg: 1.5 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}></Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 1.4 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
            <Button
                component="a"
                href="/user-add"
                type="submit"
                variant="contained"
                fullWidth sx={{
            backgroundColor: '#FF981B' ,borderRadius: 1, textTransform: 'uppercase',fontSize: 10, color: 'white', '&:hover': { backgroundColor: '#FF981B' }}}
              >
                Add Manager
            </Button>
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
                          <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="center">Actions</TableCell>
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
                              <TableCell>{row.usr_name}</TableCell>
                              <TableCell>{row.usr_last_name}</TableCell>
                              <TableCell>{row.mobile_no}</TableCell>
                              <TableCell>{row.usr_email}</TableCell>
                              <TableCell align="center">
                                <Stack direction="row" spacing={1} justifyContent="center">

                                  <Tooltip title="Edit">
                                    <IconButton
                                      size="small"
                                      component="a"
                                      href={`/user-edit/${row.usr_id}`}

                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Delete">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDelete(row.usr_id)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>

                                </Stack>
                              </TableCell>
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
