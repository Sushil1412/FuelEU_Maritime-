import type { BankRepository } from '../../../core/ports/outbound/BankRepository.js';
import { BankEntry } from '../../../core/domain/BankEntry.js';
import { prisma } from '../../../infrastructure/db/prismaClient.js';

export class BankRepositoryImpl implements BankRepository {
  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const entries = await prisma.bankEntry.findMany({
      where: { shipId, year },
    });

    return entries.map(
      (e) => new BankEntry(e.id, e.shipId, e.year, e.amountGco2eq)
    );
  }

  async create(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const entry = await prisma.bankEntry.create({
      data: {
        shipId,
        year,
        amountGco2eq: amount,
      },
    });

    return new BankEntry(entry.id, entry.shipId, entry.year, entry.amountGco2eq);
  }

  async getTotalBanked(shipId: string, year: number): Promise<number> {
    const result = await prisma.bankEntry.aggregate({
      where: { shipId, year },
      _sum: {
        amountGco2eq: true,
      },
    });

    return result._sum.amountGco2eq || 0;
  }

  async updateBanked(shipId: string, year: number, amount: number): Promise<void> {
    // This would be used to reduce banked amount when applying
    // For simplicity, we'll create negative entries
    await prisma.bankEntry.create({
      data: {
        shipId,
        year,
        amountGco2eq: -amount,
      },
    });
  }
}

