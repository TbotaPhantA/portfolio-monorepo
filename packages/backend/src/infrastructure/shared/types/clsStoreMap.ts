import { UserPayload } from '@portfolio/contracts';
import { ClsStore } from 'nestjs-cls';

export interface ClsStoreMap extends ClsStore {
  user: UserPayload;
}
