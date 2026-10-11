import { Inject, Injectable } from '@nestjs/common';
import { DATABASE } from '../common/core.module';
import type { DB } from '../db/db';

export interface AuditEntry {
  actorId?: string | null;
  action: string;
  objectType: string;
  objectId?: string | null;
  reason?: string;
  /** Solo identificadores y conteos. Nunca correos ni textos libres de personas. */
  meta?: Record<string, string | number | boolean | null>;
}

@Injectable()
export class AuditService {
  constructor(@Inject(DATABASE) private readonly db: DB) {}

  async log(e: AuditEntry, trx: DB = this.db) {
    await trx
      .insertInto('auditEvents')
      .values({
        actorId: e.actorId ?? null,
        action: e.action,
        objectType: e.objectType,
        objectId: e.objectId ?? null,
        reason: e.reason ?? '',
        meta: JSON.stringify(e.meta ?? {}),
      })
      .execute();
  }
}
