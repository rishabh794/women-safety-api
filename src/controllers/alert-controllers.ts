import { createHandler } from '@/utils/create';
import { createAlert } from '@/services/alert-service';
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
