import bcrypt from 'bcrypt';
import { db } from '../db';
import { users, userStats } from '../db/schema';

async function createUser() {
  const email = process.env.SEED_EMAIL ?? 'marshal.t.burton@gmail.com';
  const password = process.env.SEED_PASSWORD;

  if (!password) {
    console.error('Set SEED_PASSWORD env var before running this script.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  const [user] = await db.insert(users).values({ email, passwordHash: hash }).returning();
  await db.insert(userStats).values({ userId: user.id });

  console.log('User created:', user.id, user.email);
  process.exit(0);
}

createUser().catch((err) => {
  console.error(err);
  process.exit(1);
});
