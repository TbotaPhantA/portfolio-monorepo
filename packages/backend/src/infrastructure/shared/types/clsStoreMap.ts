import { UserPayload } from './userPayload';
import { ClsStore } from 'nestjs-cls';

export interface ClsStoreMap extends ClsStore {
  user: UserPayload;
}
