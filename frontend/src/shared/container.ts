import { RouteApiAdapter } from '../adapters/infrastructure/RouteApiAdapter';
import { ComplianceApiAdapter } from '../adapters/infrastructure/ComplianceApiAdapter';
import { BankingApiAdapter } from '../adapters/infrastructure/BankingApiAdapter';
import { PoolingApiAdapter } from '../adapters/infrastructure/PoolingApiAdapter';
import {
  createRouteUseCases,
  createComplianceUseCases,
  createBankingUseCases,
  createPoolingUseCases,
} from '../core/application/useCases';

const routePort = new RouteApiAdapter();
const compliancePort = new ComplianceApiAdapter();
const bankingPort = new BankingApiAdapter();
const poolingPort = new PoolingApiAdapter();

export const routeUseCases = createRouteUseCases(routePort);
export const complianceUseCases = createComplianceUseCases(compliancePort);
export const bankingUseCases = createBankingUseCases(bankingPort);
export const poolingUseCases = createPoolingUseCases(poolingPort);

