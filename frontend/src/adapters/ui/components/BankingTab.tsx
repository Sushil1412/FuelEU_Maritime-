import { useMemo, useState } from 'react';
import type { BankEntry, BankingActionResult, ComplianceBalance } from '../../../core/domain/models';
import { bankingUseCases, complianceUseCases } from '../../../shared/container';
import { useAsyncData } from '../hooks/useAsyncData';

const formatNumber = (value: number, digits = 0) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);

export const BankingTab = () => {
  const currentYear = new Date().getFullYear();
  const [shipId, setShipId] = useState('SHIP-001');
  const [year, setYear] = useState(currentYear);
  const [amount, setAmount] = useState(1000);
  const [lastAction, setLastAction] = useState<BankingActionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const complianceQuery = useAsyncData<ComplianceBalance>(
    () => complianceUseCases.getComplianceBalance(shipId, year),
    [shipId, year],
  );

  const adjustedQuery = useAsyncData<ComplianceBalance>(
    () => complianceUseCases.getAdjustedComplianceBalance(shipId, year),
    [shipId, year, complianceQuery.data?.cbGco2eq],
  );

  const bankRecordsQuery = useAsyncData<BankEntry[]>(
    () => bankingUseCases.getBankEntries(shipId, year),
    [shipId, year, lastAction],
  );

  const canBank = (complianceQuery.data?.cbGco2eq ?? 0) > 0;
  const canApply = (bankRecordsQuery.data?.reduce((sum, entry) => sum + entry.amountGco2eq, 0) ?? 0) > 0;

  const stats = useMemo(() => {
    if (!complianceQuery.data) return null;
    return [
      {
        label: 'Compliance Balance (CB)',
        value: complianceQuery.data.cbGco2eq,
        highlight: complianceQuery.data.cbGco2eq >= 0 ? 'text-lime' : 'text-coral',
      },
      {
        label: 'Adjusted CB (after banking)',
        value: adjustedQuery.data?.cbGco2eq ?? 0,
        highlight: adjustedQuery.data && adjustedQuery.data.cbGco2eq >= 0 ? 'text-lime' : 'text-coral',
      },
      {
        label: 'Last action applied',
        value: lastAction?.applied ?? 0,
        highlight: 'text-white',
      },
    ];
  }, [complianceQuery.data, adjustedQuery.data, lastAction]);

  const handleAction = async (action: 'bank' | 'apply') => {
    try {
      setError(null);
      const result =
        action === 'bank'
          ? await bankingUseCases.bankSurplus(shipId, year, amount)
          : await bankingUseCases.applyBanked(shipId, year, amount);
      setLastAction(result);
      complianceQuery.reload();
      adjustedQuery.reload();
      bankRecordsQuery.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
          Ship ID
          <input
            value={shipId}
            onChange={(event) => setShipId(event.target.value)}
            className="mt-2 w-full rounded-lg border border-white/20 bg-slate-900 px-4 py-2 text-white focus:border-ocean focus:outline-none"
          />
        </label>
        <label className="rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
          Year
          <input
            type="number"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-white/20 bg-slate-900 px-4 py-2 text-white focus:border-ocean focus:outline-none"
          />
        </label>
        <label className="rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
          Amount (gCO₂e)
          <input
            type="number"
            value={amount}
            min={0}
            onChange={(event) => setAmount(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-white/20 bg-slate-900 px-4 py-2 text-white focus:border-ocean focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats?.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/60">{stat.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${stat.highlight}`}>
              {formatNumber(stat.value ?? 0, 0)}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/10 p-6">
        {error && <p className="mb-4 rounded-lg bg-coral/20 p-3 text-coral">{error}</p>}
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => handleAction('bank')}
            disabled={!canBank}
            className="rounded-xl bg-ocean px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Bank Surplus
          </button>
          <button
            type="button"
            onClick={() => handleAction('apply')}
            disabled={!canApply}
            className="rounded-xl bg-amber px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply Banked Surplus
          </button>
        </div>
        <p className="mt-3 text-sm text-white/70">
          Actions are disabled when prerequisites are not met (positive CB required to bank; recorded
          surplus required to apply).
        </p>
      </div>

      <div className="rounded-2xl bg-white/5">
        <header className="flex items-center justify-between border-b border-white/10 p-4 text-sm text-white/70">
          <span>Banking Entries</span>
          <button type="button" className="text-ocean underline" onClick={bankRecordsQuery.reload}>
            Refresh
          </button>
        </header>
        {bankRecordsQuery.loading && <p className="p-4 text-slate-200">Loading records…</p>}
        {bankRecordsQuery.error && (
          <p className="p-4 text-coral">{bankRecordsQuery.error}</p>
        )}
        {!bankRecordsQuery.loading && !bankRecordsQuery.error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
              <thead className="bg-white/5 uppercase tracking-wide text-white/60">
                <tr>
                  <th className="px-4 py-3 text-left">Entry ID</th>
                  <th className="px-4 py-3 text-left">Amount (gCO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bankRecordsQuery.data?.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3">{entry.id}</td>
                    <td className="px-4 py-3">{formatNumber(entry.amountGco2eq)}</td>
                  </tr>
                ))}
                {bankRecordsQuery.data?.length === 0 && (
                  <tr>
                    <td className="px-4 py-3" colSpan={2}>
                      No entries yet. Execute a banking action to see it here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

