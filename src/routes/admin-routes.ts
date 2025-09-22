import type { Router } from 'express';
import {
  handleDeleteAllUnverifiedUsers,
  handleGetAllAlerts,
  handleGetAllUsers,
  handleGetAllVerifiedUsers,
} from '@/controllers/admin-controllers';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.use(
    authenticate({
      verifyAdmin: true,
    }),
  );

  router.get('/all-users', handleGetAllUsers);
  router.get('/all-verified-users', handleGetAllVerifiedUsers);
  router.get('/alerts', handleGetAllAlerts);
  router.delete('/remove-unverified-users', handleDeleteAllUnverifiedUsers);
});
