import type { Router } from 'express';
import { createHandler, createRouter } from '@/utils/create';
import { authenticate } from '@/middlewares/auth';
import { newGuardianSchema, updateGuardianSchema } from '@/schema/guardian';
import {
  handleAddGuardian,
  handleDeleteGuardian,
  handleGetGuardians,
  handleUpdateGuardian,
} from '@/controllers/guardian-controllers';

export default createRouter((router: Router) => {
  router.use(authenticate());

  router.get('/', handleGetGuardians);
  router.post('/', createHandler(newGuardianSchema, handleAddGuardian));
  router.put('/:guardianId', createHandler(updateGuardianSchema, handleUpdateGuardian));
  router.delete('/:guardianId', handleDeleteGuardian);
});
