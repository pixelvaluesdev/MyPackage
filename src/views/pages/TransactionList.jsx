// material-ui
import * as React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { useEffect, useState } from "react";
// project imports
import MainCard from 'components/cards/MainCard';
import { transactions } from "../../api/auth.api";

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
 
  const [usersData, setUsersData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try { 
        const res = await transactions();
        const data = res?.data?.data || [];
        const csvdata = data.map((user) => ({
          locker_no: user.locker_no,
          user_name: user.user_name,
          vendor: user.vendor,
          compartment_size: user.compartment_size,
          flat_no: user.flat_no,
          delivery_person_name: user.delivery_person_name,
          status:user.event_type,
          order_date: user.event_timestamp
        }));
        setUsersData(data);
        setCsvData(csvdata);
      } catch (error) {
        console.error("Transactions fetch error:", error);
      }
    };

    fetchUsers();
  }, []);

  const statusLists = ['DELIVERY','PICKUP'];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("First_Name");

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
          (!filters.building || row.building_no === filters.building) &&
          (!filters.floor || row.floor_no === filters.floor) &&
          (!filters.flat || row.flat_no === filters.flat) &&
          (!filters.status || row.event_type === filters.status);

        // Filter by search text safely
        const matchesSearch =
          !searchText ||
          (row.user_name?.toLowerCase().includes(searchText.toLowerCase())) ||
          (row.locker_no?.toString().includes(searchText)) ||
          (row.flat_no?.toString().includes(searchText)) ||
          (row.vendor?.toLowerCase().includes(searchText.toLowerCase())) ||
          (row.event_type?.toLowerCase().includes(searchText.toLowerCase())) ||
          (row.compartment_size?.toLowerCase().includes(searchText.toLowerCase())) ||
          (row.delivery_person_name?.toLowerCase().includes(searchText.toLowerCase())) ||
          (row.event_timestamp?.toString().includes(searchText));

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
      { key: "locker_no", header: "Locker Code" },
      { key: "user_name", header: "Customer Name" },
      { key: "vendor", header: "Vendor" },
      { key: "compartment_size", header: "Compartment Size" },
      { key: "flat_no", header: "Flat No" },
      { key: "delivery_person_name", header: "Delivery Person Name" },
      { key: "status", header: "Status"},
      { key: "order_date", header: "Order Date"}
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
    link.download = "transaction-list.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
        <Grid container spacing={GRID_SPACING}>
          <Grid size={{ xs: 12, sm: 6, lg: 12 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
            
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
                  color: '#666666'
                },

                // ⭐ placeholder color
                '& input::placeholder': {
                  color: '#666666',
                  opacity: 1
                }
            }} 
          />
          </Grid>  
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ padding: '10px 10px',borderRadius: 2,color:'black' }}>
            <Typography color="text.primary" gutterBottom variant="h4">
              All Transaction List
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2.8 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}></Grid>
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
            
            {[...new Set(usersData.map(item => item.flat_no))].map((flatNo) => (
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
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
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
              Status
            </MenuItem>
            {statusLists.map((status) => (
              <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </MenuItem>
            ))}
            </TextField>
          </Grid> 
           
          <Grid size={{ xs: 12, sm: 6, lg: 1.2 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center' }}>
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
                          <TableCell>Order Id</TableCell>
                            <TableCell>Locker Code</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Compartment Size</TableCell>
                            <TableCell>Delivery Person Name</TableCell>
                            <TableCell>Flat No</TableCell>
                            <TableCell>Order Date</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {sortedRows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} align="center">
                              No Data Found
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, i) => (
                          <TableRow key={i} hover>
                            <TableCell>#{row.transaction_id}</TableCell>
                            <TableCell>{row.locker_no}</TableCell>
                            <TableCell>{row.user_name}</TableCell>
                            <TableCell>{row.vendor}</TableCell>
                            <TableCell>
                              {row.pickup_status !== "" && row.pickup_status === "PICKUP" ? (
                                <Chip
                                  label={row.pickup_status}
                                  size="small"
                                  sx={{
                                    backgroundColor: "#4CAF50",
                                    color: "#fff",
                                    fontWeight: 500
                                  }}
                                />
                              ) : (
                                <Chip
                                  label={row.event_type}
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      row.event_type === "DELIVERY" ? "#FF5722" : "#4CAF50",
                                    color: "#fff",
                                    fontWeight: 500
                                  }}
                                />
                              )} 
                            </TableCell>
                            <TableCell>{row.compartment_size}</TableCell>
                            <TableCell>{row.delivery_person_name}</TableCell>
                            <TableCell>{row.flat_no}</TableCell>
                            <TableCell>
                              {row.pick_time !== "" && (
                                <>
                                  {row.event_timestamp}<br/>{row.pick_time}
                                </>
                              )}
                            </TableCell>
                            
                          </TableRow>
                        ))
                  )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={sortedRows.length}  // filtered + sorted length
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(+e.target.value);
                    setPage(0); // reset page when rows per page changes
                  }}
                />
            </Grid>  
              
          </Grid>
          
        </MainCard>
    </Box>
  );
}
