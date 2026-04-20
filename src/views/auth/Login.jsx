// project imports
import CommonAuthLayout from './CommonAuthLayout';
import AuthLogin from 'sections/auth/AuthLogin';
import Grid from '@mui/material/Grid';
import { GRID_SPACING } from 'config';

// ==============================|| LOGIN ||============================== //

export default function Login() {
  return (
    <Grid container spacing={GRID_SPACING}>
          <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
      {/* Login form */}
      <AuthLogin />
    </Grid>
    </Grid>
  );
}
