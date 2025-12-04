import { Route } from '../../domain/Route.js';

export interface RouteRepository {
  findAll(filters?: {
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }): Promise<Route[]>;
  
  findByRouteId(routeId: string): Promise<Route | null>;
  
  updateBaseline(routeId: string, isBaseline: boolean): Promise<Route>;
  
  findBaseline(): Promise<Route | null>;
}

