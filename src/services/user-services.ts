import process from 'node:process';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { type NewUser, type UpdateUser, type User, users } from '@/schema/user';
import { db } from '@/utils/db';
import { sendVerificationEmail } from '@/utils/email';
import { BackendError } from '@/utils/errors';
import { sha256 } from '@/utils/hash';
import generateToken from '@/utils/jwt';

export async function getUserByUserId(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
}

export async function addUser(user: NewUser) {
  const { name, email, password } = user;

  const salt = crypto.randomBytes(32);
  const code = crypto.randomBytes(32).toString('hex');
  const hashedPassword = bcrypt.hashSync(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      salt: salt.toString('hex'),
      code,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      code: users.code,
      isVerified: users.isVerified,
      isAdmin: users.isAdmin,
    });

  if (!newUser) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to add user',
    });
  }
  const token = generateToken(newUser.id);

  return { user: newUser, code, token };
}

export async function verifyUser(email: string, code: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user)
    throw new BackendError('USER_NOT_FOUND');

  if (user.isVerified) {
    throw new BackendError('CONFLICT', {
      message: 'User already verified',
    });
  }

  const isVerified = sha256.verify(code, user.code);

  if (!isVerified) {
    throw new BackendError('UNAUTHORIZED', {
      message: 'Invalid verification code',
    });
  }

  const [updatedUser] = await db
    .update(users)
    .set({ isVerified })
    .where(eq(users.email, email))
    .returning({ id: users.id });

  if (!updatedUser) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to verify user',
    });
  }
}

export async function deleteUser(email: string) {
  const user = await getUserByEmail(email);

  if (!user)
    throw new BackendError('USER_NOT_FOUND');

  const [deletedUser] = await db.delete(users).where(eq(users.email, email)).returning({
    id: users.id,
    name: users.name,
    email: users.email,
  });

  return deletedUser;
}

export async function updateUser(user: User, { name, email, password }: UpdateUser) {
  if (email) {
    const existingUser = await getUserByEmail(email);

    if (existingUser && existingUser.id !== user.id) {
      throw new BackendError('CONFLICT', {
        message: 'Email already in use',
        details: { email },
      });
    }
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      name,
      password,
      email,
    })
    .where(eq(users.email, user.email))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      isAdmin: users.isAdmin,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    });

  if (!updatedUser) {
    throw new BackendError('USER_NOT_FOUND', {
      message: 'User could not be updated',
    });
  }

  return updatedUser;
}
