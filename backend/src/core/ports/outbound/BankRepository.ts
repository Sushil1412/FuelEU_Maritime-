import { BankEntry } from '../../domain/BankEntry.js';

export interface BankRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  
  create(shipId: string, year: number, amount: number): Promise<BankEntry>;
  
  getTotalBanked(shipId: string, year: number): Promise<number>;
  
  updateBanked(shipId: string, year: number, amount: number): Promise<void>;
}

