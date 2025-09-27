import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './user';

export const guardians = pgTable('guardians', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  phoneNumber: text('phone_number').notNull(),
  email: text('email'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
});

export const selectGuardianSchema = createSelectSchema(guardians);

export const newGuardianSchema = z.object({
  body: selectGuardianSchema.pick({
    name: true,
    phoneNumber: true,
    email: true,
  }).extend({
    phoneNumber: z.string().regex(/^\+[1-9]\d{10,14}$/, { message: 'Phone number must be in international format (e.g., +919876543210)' }),
  }).partial({
    email: true,
  }),
});

export const updateGuardianSchema = z.object({
  body: selectGuardianSchema.pick({
    name: true,
    phoneNumber: true,
    email: true,
  }).extend({
    phoneNumber: z.string().regex(/^\+[1-9]\d{10,14}$/, { message: 'Phone number must be in international format (e.g., +919876543210)' }).optional(),
  }).partial(),
});

export type Guardian = InferSelectModel<typeof guardians>;
export type NewGuardian = InferInsertModel<typeof guardians>;
export type UpdateGuardian = z.infer<typeof updateGuardianSchema>['body'];
