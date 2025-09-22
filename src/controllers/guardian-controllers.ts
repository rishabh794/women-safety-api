import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';
import {
  addGuardian,
  deleteGuardian,
  getGuardianById,
  getGuardiansByUserId,
  updateGuardian,
} from '@/services/guardian-service';
import type { User } from '@/schema/user';

export const handleGetGuardians = createHandler(async (req, res) => {
  const { user } = res.locals as { user: User };
  const userGuardians = await getGuardiansByUserId(user.id);
  res.status(200).json({ guardians: userGuardians });
});

export const handleAddGuardian = createHandler(async (req, res) => {
  const { user } = res.locals as { user: User };
  const userGuardians = await getGuardiansByUserId(user.id);

  if (userGuardians.length >= 3) {
    throw new BackendError('BAD_REQUEST', {
      message: 'You can only have a maximum of 3 guardians.',
    });
  }

  const newGuardian = await addGuardian({ ...req.body, userId: user.id });
  res.status(201).json({ guardian: newGuardian });
});

export const handleUpdateGuardian = createHandler(async (req, res) => {
  const { guardianId } = req.params;
  if (!guardianId) {
    throw new BackendError('BAD_REQUEST', {
      message: 'Guardian ID is required',
    });
  }
  const { user } = res.locals as { user: User };
  const guardian = await getGuardianById(guardianId);

  if (!guardian || guardian.userId !== user.id) {
    throw new BackendError('UNAUTHORIZED', {
      message: 'You are not authorized to update this guardian.',
    });
  }

  const updatedGuardian = await updateGuardian(guardianId, req.body);
  res.status(200).json({ guardian: updatedGuardian });
});

export const handleDeleteGuardian = createHandler(async (req, res) => {
  const { guardianId } = req.params;
  const { user } = res.locals as { user: User };
  if (!guardianId) {
    throw new BackendError('BAD_REQUEST', {
      message: 'Guardian ID is required',
    });
  }

  const deletedGuardian = await deleteGuardian(guardianId, user.id);

  if (!deletedGuardian) {
    throw new BackendError('NOT_FOUND', {
      message: 'Guardian not found or you are not authorized to delete it.',
    });
  }

  res.status(200).json({ message: 'Guardian successfully deleted.' });
});
