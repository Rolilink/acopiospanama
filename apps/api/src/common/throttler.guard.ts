import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { loadConfig } from '../config';

/** Límites por IP. Con RELAX_RATE_LIMITS (solo desarrollo/pruebas; prohibido en producción) se omiten. */
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected override async shouldSkip(context: ExecutionContext): Promise<boolean> {
    if (loadConfig().RELAX_RATE_LIMITS) return true;
    return super.shouldSkip(context);
  }
}
