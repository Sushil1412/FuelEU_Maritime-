import { BankEntry } from '../../domain/BankEntry.js';
import { ComplianceBalance } from '../../domain/ComplianceBalance.js';

export interface BankingService {
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
  
  bankSurplus(shipId: string, year: number, amount: number): Promise<{
    cbBefore: number;
    applied: number;
    cbAfter: number;
  }>;
  
  applyBanked(shipId: string, year: number, amount: number): Promise<{
    cbBefore: number;
    applied: number;
    cbAfter: number;
  }>;
}

