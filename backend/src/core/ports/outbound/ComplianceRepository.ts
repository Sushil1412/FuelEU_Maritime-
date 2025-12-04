import { ComplianceBalance } from '../../domain/ComplianceBalance.js';

export interface ComplianceRepository {
  findOrCreate(shipId: string, year: number): Promise<ComplianceBalance>;
  
  save(complianceBalance: ComplianceBalance): Promise<ComplianceBalance>;
}

