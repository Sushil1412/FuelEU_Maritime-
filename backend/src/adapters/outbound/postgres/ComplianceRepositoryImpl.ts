import type { ComplianceRepository } from '../../../core/ports/outbound/ComplianceRepository.js';
import { ComplianceBalance } from '../../../core/domain/ComplianceBalance.js';
import { prisma } from '../../../infrastructure/db/prismaClient.js';

export class ComplianceRepositoryImpl implements ComplianceRepository {
  async findOrCreate(shipId: string, year: number): Promise<ComplianceBalance> {
    let compliance = await prisma.shipCompliance.findFirst({
      where: { shipId, year },
    });

    if (!compliance) {
      // Calculate CB from routes (simplified - in real app, this would be more complex)
      const cbGco2eq = 0; // Will be calculated in use case
      compliance = await prisma.shipCompliance.create({
        data: {
          shipId,
          year,
          cbGco2eq,
        },
      });
    }

    return new ComplianceBalance(compliance.shipId, compliance.year, compliance.cbGco2eq);
  }

  async save(complianceBalance: ComplianceBalance): Promise<ComplianceBalance> {
    // Try to find existing record
    const existing = await prisma.shipCompliance.findFirst({
      where: {
        shipId: complianceBalance.shipId,
        year: complianceBalance.year,
      },
    });

    let compliance;
    if (existing) {
      compliance = await prisma.shipCompliance.update({
        where: { id: existing.id },
        data: { cbGco2eq: complianceBalance.cbGco2eq },
      });
    } else {
      compliance = await prisma.shipCompliance.create({
        data: {
          shipId: complianceBalance.shipId,
          year: complianceBalance.year,
          cbGco2eq: complianceBalance.cbGco2eq,
        },
      });
    }

    return new ComplianceBalance(compliance.shipId, compliance.year, compliance.cbGco2eq);
  }
}

