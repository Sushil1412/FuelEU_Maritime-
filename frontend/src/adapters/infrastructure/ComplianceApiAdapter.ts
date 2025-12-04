import type { CompliancePort } from '../../core/ports/CompliancePort';
import type { ComplianceBalance } from '../../core/domain/models';
import { httpClient } from '../../shared/httpClient';

export class ComplianceApiAdapter implements CompliancePort {
  fetchComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    return httpClient.get<ComplianceBalance>(`/compliance/cb?shipId=${shipId}&year=${year}`);
  }

  fetchAdjustedComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    return httpClient.get<ComplianceBalance>(
      `/compliance/adjusted-cb?shipId=${shipId}&year=${year}`,
    );
  }
}

