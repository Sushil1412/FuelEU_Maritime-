import type { PoolingService as IPoolingService } from '../ports/inbound/PoolingService.js';
import { Pool, PoolMember } from '../domain/Pool.js';
import { ComplianceServiceImpl } from './ComplianceService.js';
import type { PoolRepository } from '../ports/outbound/PoolRepository.js';

export class PoolingServiceImpl implements IPoolingService {
  constructor(
    private complianceService: ComplianceServiceImpl,
    private poolRepository: PoolRepository
  ) {}

  async createPool(year: number, shipIds: string[]): Promise<Pool> {
    if (shipIds.length === 0) {
      throw new Error('Pool must have at least one member');
    }

    // Get CB for all ships
    const membersData: Array<{ shipId: string; cbBefore: number }> = [];
    let totalCB = 0;

    for (const shipId of shipIds) {
      const cb = await this.complianceService.getAdjustedComplianceBalance(shipId, year);
      membersData.push({ shipId, cbBefore: cb.cbGco2eq });
      totalCB += cb.cbGco2eq;
    }

    // Validate: Sum(adjustedCB) >= 0
    if (totalCB < 0) {
      throw new Error('Pool sum is negative. Cannot create pool.');
    }

    // Greedy allocation: sort by CB descending, transfer surplus to deficits
    const sortedMembers = [...membersData].sort((a, b) => b.cbBefore - a.cbBefore);
    const members: PoolMember[] = [];
    const deficits: Array<{ index: number; amount: number }> = [];
    const surpluses: Array<{ index: number; amount: number }> = [];

    // Identify deficits and surpluses
    for (let i = 0; i < sortedMembers.length; i++) {
      if (sortedMembers[i].cbBefore < 0) {
        deficits.push({ index: i, amount: Math.abs(sortedMembers[i].cbBefore) });
      } else if (sortedMembers[i].cbBefore > 0) {
        surpluses.push({ index: i, amount: sortedMembers[i].cbBefore });
      }
    }

    // Allocate surpluses to deficits
    const allocations = new Map<number, number>();
    for (const deficit of deficits) {
      let remaining = deficit.amount;
      for (const surplus of surpluses) {
        if (remaining <= 0) break;
        const allocated = Math.min(remaining, surplus.amount);
        allocations.set(surplus.index, (allocations.get(surplus.index) || 0) + allocated);
        remaining -= allocated;
      }
    }

    // Calculate cbAfter for each member
    for (let i = 0; i < sortedMembers.length; i++) {
      const member = sortedMembers[i];
      let cbAfter = member.cbBefore;

      if (member.cbBefore < 0) {
        // Deficit: should improve (become less negative or zero)
        const improvement = allocations.get(i) || 0;
        cbAfter = member.cbBefore + improvement;
        if (cbAfter > member.cbBefore) {
          throw new Error('Deficit ship cannot exit worse');
        }
      } else if (member.cbBefore > 0) {
        // Surplus: can be reduced but not go negative
        const reduction = allocations.get(i) || 0;
        cbAfter = member.cbBefore - reduction;
        if (cbAfter < 0) {
          throw new Error('Surplus ship cannot exit negative');
        }
      }

      members.push(new PoolMember(member.shipId, member.cbBefore, cbAfter));
    }

    return this.poolRepository.create(year, members);
  }
}

