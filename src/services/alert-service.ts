import { desc } from 'drizzle-orm';
import { getGuardiansByUserId } from './guardian-service';
import { getUserByUserId } from './user-services';
import { sendSms } from './sms-services';
import { db } from '@/utils/db';
import { alerts } from '@/schema/alert';
import type { NewAlert } from '@/schema/alert';

export async function createAlert(alertData: NewAlert) {
  const [newAlert] = await db.insert(alerts).values(alertData).returning();

  if (newAlert) {
    const user = await getUserByUserId(newAlert.userId);
    const guardians = await getGuardiansByUserId(newAlert.userId);
    const mapsLink = `https://www.google.com/maps?q=${newAlert.latitude},${newAlert.longitude}`;
    const messageBody = `Emergency Alert: ${user?.name} has triggered an SOS. Last known location: ${mapsLink}`;

    for (const guardian of guardians)
      await sendSms(guardian.phoneNumber, messageBody);
  }

  return newAlert;
}

export async function getAllAlerts() {
  return db.select().from(alerts).orderBy(desc(alerts.createdAt));
}
