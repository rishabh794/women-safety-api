import { pgEnum, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { InferInsertModel } from 'drizzle-orm';
import { users } from './user';

export const alertStatusEnum = pgEnum('alert_status', ['active', 'resolved']);

export const alerts = pgTable('alerts', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  status: alertStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
});

export type NewAlert = InferInsertModel<typeof alerts>;
