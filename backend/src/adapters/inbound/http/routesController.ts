import type { Request, Response } from 'express';
import type { RouteService } from '../../../core/ports/inbound/RouteService.js';

export class RoutesController {
  constructor(private routeService: RouteService) {}

  async getAllRoutes(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        vesselType: req.query.vesselType as string | undefined,
        fuelType: req.query.fuelType as string | undefined,
        year: req.query.year ? parseInt(req.query.year as string) : undefined,
      };

      const routes = await this.routeService.getAllRoutes(filters);
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async setBaseline(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const route = await this.routeService.setBaseline(routeId);
      res.json(route);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async getComparison(req: Request, res: Response): Promise<void> {
    try {
      const targetIntensity = req.query.target
        ? parseFloat(req.query.target as string)
        : undefined;
      const comparisons = await this.routeService.getComparison(targetIntensity);
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

