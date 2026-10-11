import { Global, Inject, Injectable, Module, OnApplicationShutdown } from '@nestjs/common';
import { AppConfig, loadConfig } from '../config';
import { createDb, DB } from '../db/db';
import { Keys } from './crypto';

export const CONFIG = Symbol('CONFIG');
export const DATABASE = Symbol('DATABASE');
export const KEYS = Symbol('KEYS');

@Injectable()
class DbCloser implements OnApplicationShutdown {
  constructor(@Inject(DATABASE) private readonly db: DB) {}
  async onApplicationShutdown() {
    await this.db.destroy();
  }
}

@Global()
@Module({
  providers: [
    { provide: CONFIG, useFactory: (): AppConfig => loadConfig() },
    { provide: DATABASE, useFactory: (c: AppConfig) => createDb(c.DATABASE_URL), inject: [CONFIG] },
    { provide: KEYS, useFactory: (c: AppConfig) => new Keys(c.SECRET_KEY), inject: [CONFIG] },
    DbCloser,
  ],
  exports: [CONFIG, DATABASE, KEYS],
})
export class CoreModule {}
