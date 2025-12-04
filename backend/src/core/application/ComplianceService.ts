import type { ComplianceService as IComplianceService } from '../ports/inbound/ComplianceService.js';
import { ComplianceBalance } from '../domain/ComplianceBalance.js';
import type { ComplianceRepository } from '../ports/outbound/ComplianceRepository.js';
import type { RouteRepository } from '../ports/outbound/RouteRepository.js';
import type { BankRepository } from '../ports/outbound/BankRepository.js';

const TARGET_INTENSITY_2025 = 89.3368;
const ENERGY_PER_TONNE = 41000; // MJ/t

export class ComplianceServiceImpl implements IComplianceService {
  constructor(
    private complianceRepository: ComplianceRepository,
    private routeRepository: RouteRepository,
    private bankRepository: BankRepository
  ) {}

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    // Calculate CB from routes for this ship/year
    const routes = await this.routeRepository.findAll({ year });
    
    let totalCB = 0;
    for (const route of routes) {
      // Energy in scope (MJ) = fuelConsumption × 41,000 MJ/t
      const energyInScope = route.fuelConsumption * ENERGY_PER_TONNE;
      // CB = (Target - Actual) × Energy in scope
      const cb = (TARGET_INTENSITY_2025 - route.ghgIntensity) * energyInScope;
      totalCB += cb;
    }

    // Get or create compliance record
    const compliance = await this.complianceRepository.findOrCreate(shipId, year);
    
    // Update with calculated CB
    const updatedCompliance = new ComplianceBalance(shipId, year, totalCB);
    return this.complianceRepository.save(updatedCompliance);
  }

  async getAdjustedComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    const baseCB = await this.getComplianceBalance(shipId, year);
    
    // Subtract banked amounts that have been applied
    const totalBanked = await this.bankRepository.getTotalBanked(shipId, year);
    
    // Adjusted CB = base CB - applied banked amounts
    const adjustedCB = baseCB.cbGco2eq - totalBanked;
    
    return new ComplianceBalance(shipId, year, adjustedCB);
  }
}

