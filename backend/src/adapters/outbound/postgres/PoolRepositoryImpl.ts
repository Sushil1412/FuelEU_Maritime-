import type { PoolRepository } from '../../../core/ports/outbound/PoolRepository.js';
import { Pool, PoolMember } from '../../../core/domain/Pool.js';
import { prisma } from '../../../infrastructure/db/prismaClient.js';

export class PoolRepositoryImpl implements PoolRepository {
  async create(year: number, members: PoolMember[]): Promise<Pool> {
    const pool = await prisma.pool.create({
      data: {
        year,
        members: {
          create: members.map((m) => ({
            shipId: m.shipId,
            cbBefore: m.cbBefore,
            cbAfter: m.cbAfter,
          })),
        },
      },
      include: {
        members: true,
      },
    });

    const poolMembers = pool.members.map(
      (m) => new PoolMember(m.shipId, m.cbBefore, m.cbAfter)
    );

    return new Pool(pool.id, pool.year, poolMembers);
  }
}

