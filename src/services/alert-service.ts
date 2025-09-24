import process from 'node:process';
import 'dotenv/config';
import { desc, eq } from 'drizzle-orm';
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
    const trackingLink = `${process.env.FRONTEND_URL}/track/${newAlert.id}`;
    const messageBody = `Emergency Alert: ${user?.name} has triggered an SOS. View their live location here: ${trackingLink}`;

    for (const guardian of guardians)
      await sendSms(guardian.phoneNumber, messageBody);
  }

  return newAlert;
}

export async function getAllAlerts() {
  return db.select().from(alerts).orderBy(desc(alerts.createdAt));
}

export async function getAlertById(alertId: string) {
  const [alert] = await db.select().from(alerts).where(eq(alerts.id, alertId));
  return alert;
}
