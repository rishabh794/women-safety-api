import type { Router } from 'express';
import { z } from 'zod';
import { createHandler, createRouter } from '@/utils/create';
import { authenticate } from '@/middlewares/auth';
import { handleCreateAlert } from '@/controllers/alert-controllers';

export const createAlertSchema = z.object({
  body: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export default createRouter((router: Router) => {
  router.post('/', authenticate(), createHandler(createAlertSchema, handleCreateAlert));
});
