import { useEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Header from './Header';

import { DRAWER_WIDTH } from 'config';
import { handlerDrawerOpen, useGetMenuMaster } from 'states/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const upLG = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const { menuMaster } = useGetMenuMaster();
 

  return (
    <Stack direction="row" width={1}>
      <Header />
      <Box
        component="main"
        sx={{
          width: { xs: 1 },
          p: { xs: 2, sm: 3, md: 5 }, ml: { xs: 0, lg: 'auto' }       // extra safety
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Stack>
  );
}
