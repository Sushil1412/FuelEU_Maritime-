import { ComplianceBalance } from '../../domain/ComplianceBalance.js';

export interface ComplianceService {
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  
  getAdjustedComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
}

