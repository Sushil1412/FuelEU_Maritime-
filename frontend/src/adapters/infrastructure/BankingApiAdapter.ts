import type { BankingPort } from '../../core/ports/BankingPort';
import type { BankEntry, BankingActionResult } from '../../core/domain/models';
import { httpClient } from '../../shared/httpClient';

export class BankingApiAdapter implements BankingPort {
  fetchBankEntries(shipId: string, year: number): Promise<BankEntry[]> {
    return httpClient.get<BankEntry[]>(`/banking/records?shipId=${shipId}&year=${year}`);
  }

  bankSurplus(shipId: string, year: number, amount: number): Promise<BankingActionResult> {
    return httpClient.post<BankingActionResult>('/banking/bank', { shipId, year, amount });
  }

  applyBanked(shipId: string, year: number, amount: number): Promise<BankingActionResult> {
    return httpClient.post<BankingActionResult>('/banking/apply', { shipId, year, amount });
  }
}

