import { useCallback, useEffect, useState } from 'react';

type AsyncStatus<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export const useAsyncData = <T,>(factory: () => Promise<T>, deps: unknown[] = []): AsyncStatus<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const reload = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    factory()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, refreshIndex]);

  return { data, loading, error, reload };
};

