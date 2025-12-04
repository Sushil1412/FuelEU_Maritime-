import type { RoutePort } from '../../core/ports/RoutePort';
import type { Route, RouteComparison, RouteFilters } from '../../core/domain/models';
import { httpClient } from '../../shared/httpClient';

const buildQuery = (filters?: RouteFilters) => {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.vesselType) params.set('vesselType', filters.vesselType);
  if (filters.fuelType) params.set('fuelType', filters.fuelType);
  if (filters.year) params.set('year', String(filters.year));
  const query = params.toString();
  return query ? `?${query}` : '';
};

export class RouteApiAdapter implements RoutePort {
  fetchRoutes(filters?: RouteFilters): Promise<Route[]> {
    return httpClient.get<Route[]>(`/routes${buildQuery(filters)}`);
  }

  setBaseline(routeId: string): Promise<Route> {
    return httpClient.post<Route>(`/routes/${routeId}/baseline`);
  }

  fetchComparisons(targetIntensity?: number): Promise<RouteComparison[]> {
    const query = targetIntensity ? `?target=${targetIntensity}` : '';
    return httpClient.get<RouteComparison[]>(`/routes/comparison${query}`);
  }
}

