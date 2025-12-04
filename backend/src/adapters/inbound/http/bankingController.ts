import type { Request, Response } from 'express';
import type { BankingService } from '../../../core/ports/inbound/BankingService.js';

export class BankingController {
  constructor(private bankingService: BankingService) {}

  async getBankRecords(req: Request, res: Response): Promise<void> {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const records = await this.bankingService.getBankRecords(shipId, year);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async bankSurplus(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        res.status(400).json({ error: 'shipId, year, and amount are required' });
        return;
      }

      const result = await this.bankingService.bankSurplus(shipId, year, amount);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async applyBanked(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        res.status(400).json({ error: 'shipId, year, and amount are required' });
        return;
      }

      const result = await this.bankingService.applyBanked(shipId, year, amount);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

