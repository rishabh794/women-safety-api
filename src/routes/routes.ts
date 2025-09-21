import type { Router } from 'express';
import adminRoutes from '@/routes/admin-routes';
import userRoutes from '@/routes/user-routes';
import alertRoutes from '@/routes/alert-routes';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.use('/admin', adminRoutes);
  router.use('/user', userRoutes);
  router.use('/alerts', alertRoutes);
});
