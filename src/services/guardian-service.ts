import { and, eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import { guardians } from '@/schema/guardian';
import type { NewGuardian, UpdateGuardian } from '@/schema/guardian';

export async function getGuardiansByUserId(userId: string) {
  return db.select().from(guardians).where(eq(guardians.userId, userId));
}

export async function getGuardianById(guardianId: string) {
  const [guardian] = await db.select().from(guardians).where(eq(guardians.id, guardianId));
  return guardian;
}

export async function addGuardian(guardian: NewGuardian) {
  const [newGuardian] = await db.insert(guardians).values(guardian).returning();
  return newGuardian;
}

export async function updateGuardian(guardianId: string, guardian: UpdateGuardian) {
  const [updatedGuardian] = await db
    .update(guardians)
    .set(guardian)
    .where(eq(guardians.id, guardianId))
    .returning();
  return updatedGuardian;
}

export async function deleteGuardian(guardianId: string, userId: string) {
  const [deletedGuardian] = await db
    .delete(guardians)
    .where(and(eq(guardians.id, guardianId), eq(guardians.userId, userId)))
    .returning();
  return deletedGuardian;
}
