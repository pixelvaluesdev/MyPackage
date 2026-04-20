import { createBrowserRouter } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import PagesRoutes from './PagesRoutes';
import OtherRoutes from './OtherRoutes';
import InnerRoutes from './InnerRoutes';
// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([MainRoutes, PagesRoutes, OtherRoutes, InnerRoutes], {
  basename: import.meta.env.VITE_APP_BASE_URL
});

export default router;
