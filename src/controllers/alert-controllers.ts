import { createHandler } from '@/utils/create';
import { createAlert, getAlertById } from '@/services/alert-service';
import { BackendError } from '@/utils/errors';
import type { User } from '@/schema/user';

export const handleCreateAlert = createHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  const { user } = res.locals as { user: User };

  const newAlert = await createAlert({
    latitude,
    longitude,
    userId: user.id,
  });

  res.status(201).json({
    alert: newAlert,
    message: 'Emergency alert successfully registered.',
  });
});

export const handleGetAlert = createHandler(async (req, res) => {
  const { alertId } = req.params;
  if (!alertId) {
    throw new BackendError('NOT_FOUND', {
      message: 'Alert not found',
    });
  }
  const alert = await getAlertById(alertId);
  res.status(200).json({ alert });
});
