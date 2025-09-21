import { db } from '@/utils/db';
import { alerts } from '@/schema/alert';
import type { NewAlert } from '@/schema/alert';

export async function createAlert(alertData: NewAlert) {
  const [newAlert] = await db.insert(alerts).values(alertData).returning();
  return newAlert;
}
