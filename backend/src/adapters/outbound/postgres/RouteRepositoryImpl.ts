import type { RouteRepository } from '../../../core/ports/outbound/RouteRepository.js';
import { Route } from '../../../core/domain/Route.js';
import { prisma } from '../../../infrastructure/db/prismaClient.js';

export class RouteRepositoryImpl implements RouteRepository {
  async findAll(filters?: {
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }): Promise<Route[]> {
    const routes = await prisma.route.findMany({
      where: {
        ...(filters?.vesselType && { vesselType: filters.vesselType }),
        ...(filters?.fuelType && { fuelType: filters.fuelType }),
        ...(filters?.year && { year: filters.year }),
      },
    });

    return routes.map(
      (r) =>
        new Route(
          r.id,
          r.routeId,
          r.vesselType,
          r.fuelType,
          r.year,
          r.ghgIntensity,
          r.fuelConsumption,
          r.distance,
          r.totalEmissions,
          r.isBaseline
        )
    );
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const route = await prisma.route.findUnique({
      where: { routeId },
    });

    if (!route) return null;

    return new Route(
      route.id,
      route.routeId,
      route.vesselType,
      route.fuelType,
      route.year,
      route.ghgIntensity,
      route.fuelConsumption,
      route.distance,
      route.totalEmissions,
      route.isBaseline
    );
  }

  async updateBaseline(routeId: string, isBaseline: boolean): Promise<Route> {
    // First, unset all baselines
    await prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false },
    });

    // Then set the new baseline
    const route = await prisma.route.update({
      where: { routeId },
      data: { isBaseline },
    });

    return new Route(
      route.id,
      route.routeId,
      route.vesselType,
      route.fuelType,
      route.year,
      route.ghgIntensity,
      route.fuelConsumption,
      route.distance,
      route.totalEmissions,
      route.isBaseline
    );
  }

  async findBaseline(): Promise<Route | null> {
    const route = await prisma.route.findFirst({
      where: { isBaseline: true },
    });

    if (!route) return null;

    return new Route(
      route.id,
      route.routeId,
      route.vesselType,
      route.fuelType,
      route.year,
      route.ghgIntensity,
      route.fuelConsumption,
      route.distance,
      route.totalEmissions,
      route.isBaseline
    );
  }
}

