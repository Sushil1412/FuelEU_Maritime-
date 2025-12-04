import type { BankEntry, BankingActionResult } from '../domain/models';

export interface BankingPort {
  fetchBankEntries(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankingActionResult>;
  applyBanked(shipId: string, year: number, amount: number): Promise<BankingActionResult>;
}

