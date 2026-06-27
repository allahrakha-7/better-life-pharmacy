import { useState, useEffect, useCallback, useRef } from 'react';

export default function useFetch(fetchUrl, options) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Keep options in a ref to avoid callback re-execution on every render
    const optionsRef = useRef(options);
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const executeFetch = useCallback(async (isRefetch = false) => {
        if (isRefetch) {
            setLoading(true);
        }
        try {
            const res = await fetch(fetchUrl, optionsRef.current);
            if (!res.ok) {
                throw new Error(`Error: ${res.status} ${res.statusText}`);
            }
            const json = await res.json();
            setData(json);
            setError(null);
        } catch (err) {
            setError(err.message || 'Fetch failed');
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [fetchUrl]);

    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            try {
                const res = await fetch(fetchUrl, optionsRef.current);
                if (!isMounted) return;
                if (!res.ok) {
                    throw new Error(`Error: ${res.status} ${res.statusText}`);
                }
                const json = await res.json();
                setData(json);
                setError(null);
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Fetch failed');
                    setData(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        run();

        return () => {
            isMounted = false;
        };
    }, [fetchUrl]);

    const refetch = useCallback(() => {
        executeFetch(true);
    }, [executeFetch]);

    return { data, loading, error, refetch };
}
