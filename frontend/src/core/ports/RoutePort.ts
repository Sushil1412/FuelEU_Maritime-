import type { Route, RouteComparison, RouteFilters } from '../domain/models';

export interface RoutePort {
  fetchRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  fetchComparisons(targetIntensity?: number): Promise<RouteComparison[]>;
}

