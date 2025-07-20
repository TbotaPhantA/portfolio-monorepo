import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { Database } from '../../db/db.schema';

export type KyselyCLS = TransactionalAdapterKysely<Database>;
