// material-ui

import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';

// project imports
import MainCard from 'components/cards/MainCard';

import profileImg from 'assets/images/users/avatar-4.jpg';
import menuIcon from 'assets/images/menu_icon.png';
import fileManager from 'assets/images/file_manager.png';
// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
 
  return (
    <Box>
        <Grid container spacing={GRID_SPACING}>
          <Grid size={{ xs: 12, sm: 6, lg: 1 }} sx={{ padding: '10px 10px',borderRadius: 2, textAlign: 'center',color:'#000' }}>
            <IconButton size="small" component="a" href="/profile-edit">
            <CardMedia component="img" image={profileImg} alt="profile" sx={{ width: 60, height: 60, borderRadius: '50%' }} />
            </IconButton>
            <Typography ml={1} mb={3} variant="body2" sx={{ fontWeight: 500,fontSize: 12}}>
               {localStorage.getItem('user_name')}
            </Typography>
          </Grid>  
          <Grid component="a"
  href="/user-add" mt={1} size={{ xs: 12, sm: 6, lg: 1.3 }} sx={{ marginLeft: 0,padding: '10px 10px',borderRadius: 2, textAlign: 'center',textDecoration:'none',color:'#000' }}>
            <IconButton size="small">
            <CardMedia component="img" image={fileManager} alt="profile" sx={{ width: 52, height: 52, borderRadius: '50%' }} />
            </IconButton>
            <Typography ml={1} mb={3} variant="body2" sx={{ fontWeight: 500,fontSize: 12,textDecoration:'none'}}>
              Add Manager
            </Typography>
          </Grid>  
        </Grid>
        <MainCard sx={{ height: 380 }}>
          <Grid container spacing={GRID_SPACING} mb={3}>
            <Grid component="a"
  href="/user-list" size={{ xs: 12, sm: 6, lg: 2 }} sx={{ textDecoration: 'none',color:'#000',padding: '10px 10px',borderRadius: 2, backgroundColor: '#F0F0F0',textAlign: 'center' }}>
              <IconButton size="small">
              <CardMedia component="img" image={menuIcon} alt="profile" sx={{ width: 60, height: 60, borderRadius: '50%' }} />
              </IconButton>
              <Typography  ml={1} mb={3} variant="body2" sx={{ fontWeight: 500,fontSize: 12,textAlign: 'center'}}>
              Admin<br/>Users
            </Typography>
            </Grid>
            <Grid component="a"
  href="/transaction-list" size={{ xs: 12, sm: 6, lg: 2 }} sx={{ textDecoration: 'none',color:'#000',padding: '10px 10px',borderRadius: 2, backgroundColor: '#F0F0F0',textAlign: 'center' }}>
              <IconButton size="small">
              <CardMedia component="img" image={menuIcon} alt="profile" sx={{ width: 60, height: 60, borderRadius: '50%' }} />
              </IconButton>
              <Typography ml={1} mb={3} variant="body2" sx={{ fontWeight: 500,fontSize: 12,textAlign: 'center'}}>
              All<br/>Transaction
            </Typography>
            </Grid>
            <Grid component="a"
  href="/all-customer-list" size={{ xs: 12, sm: 6, lg: 2 }} sx={{ textDecoration: 'none',color:'#000',padding: '10px 10px',borderRadius: 2, backgroundColor: '#F0F0F0',textAlign: 'center' }}>
              <IconButton size="small">
              <CardMedia component="img" image={menuIcon} alt="profile" sx={{ width: 60, height: 60, borderRadius: '50%' }} />
              </IconButton>
              <Typography ml={1} mb={3} variant="body2" sx={{ fontWeight: 500,fontSize: 12,textAlign: 'center'}}>
              Customer<br/>List
            </Typography>
            </Grid>
          </Grid>
        </MainCard>
    </Box>
  );
}
