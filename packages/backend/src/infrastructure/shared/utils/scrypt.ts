import * as crypto from 'node:crypto';
import { promisify } from 'util';

export const scrypt = promisify(crypto.scrypt) as unknown as (
  password: crypto.BinaryLike,
  salt: crypto.BinaryLike,
  keylen: number,
) => Promise<Buffer>;
