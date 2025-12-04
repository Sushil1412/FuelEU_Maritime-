import type { PoolingPort } from '../../core/ports/PoolingPort';
import type { Pool } from '../../core/domain/models';
import { httpClient } from '../../shared/httpClient';

export class PoolingApiAdapter implements PoolingPort {
  createPool(year: number, shipIds: string[]): Promise<Pool> {
    return httpClient.post<Pool>('/pools', { year, shipIds });
  }
}

