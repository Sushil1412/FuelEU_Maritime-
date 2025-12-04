import { Pool, PoolMember } from '../../domain/Pool.js';

export interface PoolingService {
  createPool(year: number, shipIds: string[]): Promise<Pool>;
}

