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
  }).partial({
    email: true,
  }),
});

export const updateGuardianSchema = z.object({
  body: selectGuardianSchema.pick({
    name: true,
    phoneNumber: true,
    email: true,
  }).partial(),
});

export type Guardian = InferSelectModel<typeof guardians>;
export type NewGuardian = InferInsertModel<typeof guardians>;
export type UpdateGuardian = z.infer<typeof updateGuardianSchema>['body'];
