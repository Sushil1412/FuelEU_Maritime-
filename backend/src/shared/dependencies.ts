// Dependency Injection Container
import { RouteRepositoryImpl } from '../adapters/outbound/postgres/RouteRepositoryImpl.js';
import { ComplianceRepositoryImpl } from '../adapters/outbound/postgres/ComplianceRepositoryImpl.js';
import { BankRepositoryImpl } from '../adapters/outbound/postgres/BankRepositoryImpl.js';
import { PoolRepositoryImpl } from '../adapters/outbound/postgres/PoolRepositoryImpl.js';

import { RouteServiceImpl } from '../core/application/RouteService.js';
import { ComplianceServiceImpl } from '../core/application/ComplianceService.js';
import { BankingServiceImpl } from '../core/application/BankingService.js';
import { PoolingServiceImpl } from '../core/application/PoolingService.js';

import { RoutesController } from '../adapters/inbound/http/routesController.js';
import { ComplianceController } from '../adapters/inbound/http/complianceController.js';
import { BankingController } from '../adapters/inbound/http/bankingController.js';
import { PoolingController } from '../adapters/inbound/http/poolingController.js';

// Repositories
const routeRepository = new RouteRepositoryImpl();
const complianceRepository = new ComplianceRepositoryImpl();
const bankRepository = new BankRepositoryImpl();
const poolRepository = new PoolRepositoryImpl();

// Services
const routeService = new RouteServiceImpl(routeRepository);
const complianceService = new ComplianceServiceImpl(
  complianceRepository,
  routeRepository,
  bankRepository
);
const bankingService = new BankingServiceImpl(complianceService, bankRepository);
const poolingService = new PoolingServiceImpl(complianceService, poolRepository);

// Controllers
export const routesController = new RoutesController(routeService);
export const complianceController = new ComplianceController(complianceService);
export const bankingController = new BankingController(bankingService);
export const poolingController = new PoolingController(poolingService);

