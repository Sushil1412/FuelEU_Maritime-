import { useMemo, useState } from 'react';
import type { RouteComparison } from '../../../core/domain/models';
import { routeUseCases } from '../../../shared/container';
import { useAsyncData } from '../hooks/useAsyncData';

const TARGET_INTENSITY = 89.3368;

const formatNumber = (value: number, digits = 2) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);

export const CompareTab = () => {
  const [target, setTarget] = useState(TARGET_INTENSITY);
  const { data: comparisons, loading, error, reload } = useAsyncData<RouteComparison[]>(
    () => routeUseCases.getComparisons(target),
    [target],
  );

  const chartData = useMemo(() => {
    if (!comparisons) return [];
    return comparisons.map((item) => ({
      label: item.routeId,
      baseline: item.baselineGhgIntensity,
      comparison: item.comparisonGhgIntensity,
      compliant: item.compliant,
    }));
  }, [comparisons]);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center gap-4 rounded-2xl bg-white/10 p-6 text-slate-200">
        <div>
          <p className="text-sm uppercase tracking-wide text-white/70">Target Intensity</p>
          <p className="text-3xl font-semibold text-white">{formatNumber(target)}</p>
        </div>
        <label className="ml-auto flex items-center gap-3 text-sm text-white/80">
          Adjust Target
          <input
            type="number"
            step="0.1"
            value={target}
            onChange={(event) => setTarget(Number(event.target.value))}
            className="rounded-lg border border-white/20 bg-slate-900 px-4 py-2 text-white focus:border-ocean focus:outline-none"
          />
        </label>
      </header>

      <div className="rounded-2xl bg-white/5 p-0 backdrop-blur">
        {loading && <p className="p-6 text-slate-200">Crunching comparison data…</p>}
        {error && (
          <div className="p-6 text-coral">
            <p>{error}</p>
            <button type="button" className="mt-3 underline" onClick={reload}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-4 border-b border-white/5 p-6 md:grid-cols-2">
              {chartData.map((row) => (
                <div key={row.label} className="rounded-xl bg-white/5 p-4">
                  <div className="mb-3 flex items-center justify-between text-sm text-white/80">
                    <span className="font-semibold text-white">{row.label}</span>
                    <span className={row.compliant ? 'text-lime' : 'text-coral'}>
                      {row.compliant ? '✅ Compliant' : '❌ Non-compliant'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-white/70">
                    <div>
                      <div className="flex justify-between text-xs uppercase tracking-wide">
                        <span>Baseline</span>
                        <span>{formatNumber(row.baseline)}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-ocean"
                          style={{ width: `${Math.min((row.baseline / target) * 80, 95)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs uppercase tracking-wide">
                        <span>Actual</span>
                        <span>{formatNumber(row.comparison)}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-white/10">
                        <div
                          className={`h-2 rounded-full ${row.compliant ? 'bg-lime' : 'bg-coral'}`}
                          style={{ width: `${Math.min((row.comparison / target) * 80, 95)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
                <thead className="bg-white/5 uppercase tracking-wide text-white/70">
                  <tr>
                    {[
                      'Route ID',
                      'Vessel',
                      'Fuel',
                      'Baseline GHG',
                      'Actual GHG',
                      '% Difference',
                      'Compliant',
                    ].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comparisons?.map((item) => (
                    <tr key={item.routeId}>
                      <td className="px-4 py-3 font-semibold">{item.routeId}</td>
                      <td className="px-4 py-3">{item.vesselType}</td>
                      <td className="px-4 py-3">{item.fuelType}</td>
                      <td className="px-4 py-3">{formatNumber(item.baselineGhgIntensity)}</td>
                      <td className="px-4 py-3">{formatNumber(item.comparisonGhgIntensity)}</td>
                      <td className="px-4 py-3">
                        {formatNumber(item.percentDiff)}%
                      </td>
                      <td className="px-4 py-3">
                        {item.compliant ? (
                          <span className="text-lime">✅</span>
                        ) : (
                          <span className="text-coral">❌</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

