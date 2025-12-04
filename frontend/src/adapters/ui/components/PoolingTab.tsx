import { useState } from 'react';
import type { Pool } from '../../../core/domain/models';
import { poolingUseCases } from '../../../shared/container';

export const PoolingTab = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [shipIds, setShipIds] = useState('SHIP-001,SHIP-002');
  const [pool, setPool] = useState<Pool | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const createPool = async () => {
    try {
      setLoading(true);
      setStatus(null);
      const ids = shipIds
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
      const response = await poolingUseCases.createPool(year, ids);
      setPool(response);
      setStatus({ type: 'success', message: 'Pool created successfully' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white/10 p-6">
        {status && (
          <div
            className={`mb-4 rounded-xl px-4 py-3 text-sm ${
              status.type === 'success'
                ? 'bg-lime/10 text-lime'
                : 'bg-coral/10 text-coral'
            }`}
          >
            {status.message}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-white/80">
            Year
            <input
              type="number"
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-white/20 bg-slate-900 px-4 py-2 text-white focus:border-lime focus:outline-none"
            />
          </label>

          <label className="text-sm text-white/80">
            Ship IDs (comma separated)
            <textarea
              value={shipIds}
              onChange={(event) => setShipIds(event.target.value)}
              rows={2}
              className="mt-2 w-full rounded-xl border border-white/20 bg-slate-900 px-4 py-2 text-white focus:border-lime focus:outline-none"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={createPool}
          disabled={loading}
          className="mt-4 rounded-xl bg-lime px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-lime/30 transition hover:brightness-105 disabled:opacity-50"
        >
          {loading ? 'Creating pool…' : 'Create Pool'}
        </button>
      </div>

      {pool && (
        <div className="rounded-2xl bg-white/5">
          <header className="border-b border-white/10 p-4 text-sm text-white/70">
            Pool #{pool.id} · Year {pool.year} ·{' '}
            <span className="font-semibold text-lime">
              Σ Adjusted CB ={' '}
              {pool.members.reduce((sum, member) => sum + member.cbAfter, 0).toFixed(0)}
            </span>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
              <thead className="bg-white/5 uppercase tracking-wide text-white/60">
                <tr>
                  {['Ship ID', 'CB Before', 'CB After', 'Δ'].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pool.members.map((member) => (
                  <tr key={member.shipId}>
                    <td className="px-4 py-3 font-semibold">{member.shipId}</td>
                    <td className="px-4 py-3">{member.cbBefore.toFixed(0)}</td>
                    <td className="px-4 py-3">{member.cbAfter.toFixed(0)}</td>
                    <td className="px-4 py-3">
                      {(member.cbAfter - member.cbBefore).toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

