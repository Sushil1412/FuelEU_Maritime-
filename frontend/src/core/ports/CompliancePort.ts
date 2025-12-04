import type { ComplianceBalance } from '../domain/models';

export interface CompliancePort {
  fetchComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  fetchAdjustedComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
}

