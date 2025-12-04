import type { Request, Response } from 'express';
import type { PoolingService } from '../../../core/ports/inbound/PoolingService.js';

export class PoolingController {
  constructor(private poolingService: PoolingService) {}

  async createPool(req: Request, res: Response): Promise<void> {
    try {
      const { year, shipIds } = req.body;

      if (!year || !shipIds || !Array.isArray(shipIds)) {
        res.status(400).json({ error: 'year and shipIds array are required' });
        return;
      }

      const pool = await this.poolingService.createPool(year, shipIds);
      res.json(pool);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

