import type { BankingService as IBankingService } from '../ports/inbound/BankingService.js';
import { BankEntry } from '../domain/BankEntry.js';
import { ComplianceServiceImpl } from './ComplianceService.js';
import type { BankRepository } from '../ports/outbound/BankRepository.js';

export class BankingServiceImpl implements IBankingService {
  constructor(
    private complianceService: ComplianceServiceImpl,
    private bankRepository: BankRepository
  ) {}

  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    return this.bankRepository.findByShipAndYear(shipId, year);
  }

  async bankSurplus(
    shipId: string,
    year: number,
    amount: number
  ): Promise<{ cbBefore: number; applied: number; cbAfter: number }> {
    const cb = await this.complianceService.getComplianceBalance(shipId, year);
    
    if (cb.cbGco2eq <= 0) {
      throw new Error('Cannot bank: Compliance balance is not positive');
    }

    if (amount > cb.cbGco2eq) {
      throw new Error('Cannot bank: Amount exceeds compliance balance');
    }

    const cbBefore = cb.cbGco2eq;
    await this.bankRepository.create(shipId, year, amount);
    
    // Recalculate CB after banking
    const cbAfter = await this.complianceService.getComplianceBalance(shipId, year);

    return {
      cbBefore,
      applied: amount,
      cbAfter: cbAfter.cbGco2eq,
    };
  }

  async applyBanked(
    shipId: string,
    year: number,
    amount: number
  ): Promise<{ cbBefore: number; applied: number; cbAfter: number }> {
    const totalBanked = await this.bankRepository.getTotalBanked(shipId, year);
    
    if (amount > totalBanked) {
      throw new Error('Cannot apply: Amount exceeds available banked surplus');
    }

    const cbBefore = await this.complianceService.getAdjustedComplianceBalance(shipId, year);
    
    // Create negative entry to reduce banked amount
    await this.bankRepository.updateBanked(shipId, year, amount);
    
    const cbAfter = await this.complianceService.getAdjustedComplianceBalance(shipId, year);

    return {
      cbBefore: cbBefore.cbGco2eq,
      applied: amount,
      cbAfter: cbAfter.cbGco2eq,
    };
  }
}

