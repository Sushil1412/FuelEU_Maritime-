import type {
  Route,
  RouteComparison,
  RouteFilters,
  ComplianceBalance,
  BankEntry,
  BankingActionResult,
  Pool,
} from '../domain/models';
import type { RoutePort } from '../ports/RoutePort';
import type { CompliancePort } from '../ports/CompliancePort';
import type { BankingPort } from '../ports/BankingPort';
import type { PoolingPort } from '../ports/PoolingPort';

export const createRouteUseCases = (port: RoutePort) => ({
  getRoutes: (filters?: RouteFilters): Promise<Route[]> => port.fetchRoutes(filters),
  setBaseline: (routeId: string): Promise<Route> => port.setBaseline(routeId),
  getComparisons: (targetIntensity?: number): Promise<RouteComparison[]> =>
    port.fetchComparisons(targetIntensity),
});

export const createComplianceUseCases = (port: CompliancePort) => ({
  getComplianceBalance: (shipId: string, year: number): Promise<ComplianceBalance> =>
    port.fetchComplianceBalance(shipId, year),
  getAdjustedComplianceBalance: (shipId: string, year: number): Promise<ComplianceBalance> =>
    port.fetchAdjustedComplianceBalance(shipId, year),
});

export const createBankingUseCases = (port: BankingPort) => ({
  getBankEntries: (shipId: string, year: number): Promise<BankEntry[]> =>
    port.fetchBankEntries(shipId, year),
  bankSurplus: (shipId: string, year: number, amount: number): Promise<BankingActionResult> =>
    port.bankSurplus(shipId, year, amount),
  applyBanked: (shipId: string, year: number, amount: number): Promise<BankingActionResult> =>
    port.applyBanked(shipId, year, amount),
});

export const createPoolingUseCases = (port: PoolingPort) => ({
  createPool: (year: number, shipIds: string[]): Promise<Pool> => port.createPool(year, shipIds),
});

