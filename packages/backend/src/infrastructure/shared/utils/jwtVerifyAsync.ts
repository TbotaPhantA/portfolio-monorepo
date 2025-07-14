import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';
import {
  GetPublicKeyOrSecret,
  PublicKey,
  Secret,
  VerifyOptions,
} from 'jsonwebtoken';

export const jwtVerifyAsync = promisify(jwt.verify) as (
  token: string,
  secretOrPublicKey: Secret | PublicKey | GetPublicKeyOrSecret,
  options?: VerifyOptions & { complete?: false },
) => Promise<jwt.JwtPayload>;
