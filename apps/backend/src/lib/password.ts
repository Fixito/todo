import bcrypt from 'bcryptjs';

export async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function compare(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
