import { useMemo, useState } from 'react';
import type { Route, RouteFilters } from '../../../core/domain/models';
import { routeUseCases } from '../../../shared/container';
import { useAsyncData } from '../hooks/useAsyncData';

type FilterState = {
  vesselType: string;
  fuelType: string;
  year: string;
};

const initialFilters: FilterState = {
  vesselType: 'all',
  fuelType: 'all',
  year: 'all',
};

const formatNumber = (value: number, digits = 1) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);

export const RoutesTab = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const queryFilters: RouteFilters = useMemo(
    () => ({
      vesselType: filters.vesselType === 'all' ? undefined : filters.vesselType,
      fuelType: filters.fuelType === 'all' ? undefined : filters.fuelType,
      year: filters.year === 'all' ? undefined : Number(filters.year),
    }),
    [filters],
  );

  const { data: routes, loading, error, reload } = useAsyncData<Route[]>(
    () => routeUseCases.getRoutes(queryFilters),
    [queryFilters.vesselType, queryFilters.fuelType, queryFilters.year],
  );

  const options = useMemo(() => {
    const vesselTypes = new Set<string>();
    const fuelTypes = new Set<string>();
    const years = new Set<number>();
    routes?.forEach((route) => {
      vesselTypes.add(route.vesselType);
      fuelTypes.add(route.fuelType);
      years.add(route.year);
    });
    return {
      vesselTypes: ['all', ...Array.from(vesselTypes)],
      fuelTypes: ['all', ...Array.from(fuelTypes)],
      years: ['all', ...Array.from(years).sort().map(String)],
    };
  }, [routes]);

  const handleSetBaseline = async (routeId: string) => {
    await routeUseCases.setBaseline(routeId);
    reload();
  };

  return (
    <section className="space-y-6">
      <header className="rounded-2xl bg-white/10 p-6 backdrop-blur">
        <div className="flex flex-wrap gap-4">
          {(['vesselType', 'fuelType', 'year'] as const).map((key) => (
            <label key={key} className="flex flex-col text-sm text-slate-200">
              {key === 'vesselType' ? 'Vessel Type' : key === 'fuelType' ? 'Fuel Type' : 'Year'}
              <select
                value={filters[key]}
                onChange={(event) => setFilters((prev) => ({ ...prev, [key]: event.target.value }))}
                className="mt-2 rounded-lg border border-slate-500 bg-slate-900 px-3 py-2 text-white focus:border-ocean focus:outline-none"
              >
                {options[
                  key === 'vesselType' ? 'vesselTypes' : key === 'fuelType' ? 'fuelTypes' : 'years'
                ].map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All' : option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </header>

      <div className="rounded-2xl bg-white/5 p-0 backdrop-blur">
        {loading && <p className="p-6 text-slate-200">Loading routes…</p>}
        {error && <p className="p-6 text-coral">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
                <tr>
                  {[
                    'Route ID',
                    'Vessel',
                    'Fuel',
                    'Year',
                    'GHG (gCO₂e/MJ)',
                    'Fuel (t)',
                    'Distance (km)',
                    'Emissions (t)',
                    'Baseline',
                    'Actions',
                  ].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-100">
                {routes?.map((route) => (
                  <tr key={route.routeId} className={route.isBaseline ? 'bg-lime/5' : undefined}>
                    <td className="px-4 py-3 font-semibold text-white">{route.routeId}</td>
                    <td className="px-4 py-3">{route.vesselType}</td>
                    <td className="px-4 py-3">{route.fuelType}</td>
                    <td className="px-4 py-3">{route.year}</td>
                    <td className="px-4 py-3">{formatNumber(route.ghgIntensity)}</td>
                    <td className="px-4 py-3">{formatNumber(route.fuelConsumption)}</td>
                    <td className="px-4 py-3">{formatNumber(route.distance, 0)}</td>
                    <td className="px-4 py-3">{formatNumber(route.totalEmissions, 0)}</td>
                    <td className="px-4 py-3">
                      {route.isBaseline ? (
                        <span className="rounded-full bg-lime/20 px-3 py-1 text-xs font-semibold text-lime">
                          Baseline
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:border-lime hover:text-lime disabled:opacity-50"
                        disabled={route.isBaseline}
                        onClick={() => handleSetBaseline(route.routeId)}
                      >
                        Set Baseline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

