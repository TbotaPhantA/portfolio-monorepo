const crypto  = require('crypto');
import { promisify } from 'util';

export const scrypt = promisify(crypto.scrypt)
