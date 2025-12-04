import { Pool, PoolMember } from '../../domain/Pool.js';

export interface PoolRepository {
  create(year: number, members: PoolMember[]): Promise<Pool>;
}

