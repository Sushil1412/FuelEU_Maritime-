import { Route } from '../../domain/Route.js';
import { RouteComparison } from '../../domain/RouteComparison.js';

export interface RouteService {
  getAllRoutes(filters?: {
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }): Promise<Route[]>;
  
  setBaseline(routeId: string): Promise<Route>;
  
  getComparison(targetIntensity?: number): Promise<RouteComparison[]>;
}

