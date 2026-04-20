// material-ui
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Notification from './Notification';
import Profile from './Profile';
import Search from './Search';

import { DRAWER_WIDTH } from 'config';
import { handlerDrawerOpen, useGetMenuMaster } from 'states/menu';

// assets
import loginLogo from 'assets/images/mypackage_logo.png';
import loginSqr from 'assets/images/login_sqr.png';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

// AppBar props, including styles that vary based on drawer state and screen size
const appBar = { color: '#fff', position: 'fixed', sx: { width: 1, zIndex: { xs: 1100, lg: 1201 } } };

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  // Common header content
  const mainHeader = (
    <Toolbar sx={{ color: '#fff',bgcolor:'white' }}>
      <Stack direction="row" sx={{ color: '#fff', gap: 1, width: { xs: 1, md: DRAWER_WIDTH }, alignItems: 'center', justifyContent: 'space-between' }}>
        <CardMedia component="img" image={loginLogo} alt="logo" sx={{ width: 138, display: { xs: 'none', md: 'flex' } }} />
        <IconButton component="a"
  href="/dashboard" size="small" sx={{ color: '#FF981B' , fontSize: '18px', textDecoration: 'underline' }}>
          Dashboard
        </IconButton>
        <IconButton component="a"
  href="/analytics" size="small" sx={{ color: '#000' , fontSize: '18px', textDecoration: 'underline' }}>
          Analytics
        </IconButton>
      </Stack>
      <Box sx={{ flexGrow: 1 }}/>
      <Stack direction="row" sx={{ color: '#000',marginLeft: '25px',alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
        <Profile /> 
        <Typography>
          {localStorage.getItem('user_name')}<br />
          <span style={{ fontSize: '0.8em',textAlign: 'center' }}>
            ({localStorage.getItem('user_role') === 'admin' ? 'Admin' : 'Manager'})
          </span>
        </Typography>
      </Stack>
    </Toolbar>
  );

  return <AppBar {...appBar}>{mainHeader}</AppBar>;
}
