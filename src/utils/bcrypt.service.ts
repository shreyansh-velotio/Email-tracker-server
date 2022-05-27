import * as bcrypt from 'bcryptjs';

const SALT_OR_ROUNDS = 10;

export function hashPw(password: string): string {
  const salt = bcrypt.genSaltSync(SALT_OR_ROUNDS);

  return bcrypt.hashSync(password, salt);
}

export function comparePw(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}
