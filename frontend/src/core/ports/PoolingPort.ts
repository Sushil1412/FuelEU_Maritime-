import type { Pool } from '../domain/models';

export interface PoolingPort {
  createPool(year: number, shipIds: string[]): Promise<Pool>;
}

