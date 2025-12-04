import type { RouteService as IRouteService } from '../ports/inbound/RouteService.js';
import { Route } from '../domain/Route.js';
import { RouteComparison } from '../domain/RouteComparison.js';
import type { RouteRepository } from '../ports/outbound/RouteRepository.js';

const TARGET_INTENSITY_2025 = 89.3368; // 2% below 91.16

export class RouteServiceImpl implements IRouteService {
  constructor(private routeRepository: RouteRepository) {}

  async getAllRoutes(filters?: {
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }): Promise<Route[]> {
    return this.routeRepository.findAll(filters);
  }

  async setBaseline(routeId: string): Promise<Route> {
    const route = await this.routeRepository.findByRouteId(routeId);
    if (!route) {
      throw new Error(`Route with ID ${routeId} not found`);
    }
    return this.routeRepository.updateBaseline(routeId, true);
  }

  async getComparison(targetIntensity: number = TARGET_INTENSITY_2025): Promise<RouteComparison[]> {
    const baseline = await this.routeRepository.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route found');
    }

    const allRoutes = await this.routeRepository.findAll();
    const comparisons: RouteComparison[] = [];

    for (const route of allRoutes) {
      if (route.routeId === baseline.routeId) continue;

      const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = route.ghgIntensity <= targetIntensity;

      comparisons.push(
        new RouteComparison(
          route.routeId,
          route.vesselType,
          route.fuelType,
          route.year,
          baseline.ghgIntensity,
          route.ghgIntensity,
          percentDiff,
          compliant
        )
      );
    }

    return comparisons;
  }
}

