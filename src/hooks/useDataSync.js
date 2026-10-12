import { useEffect, useRef } from 'react';

/**
 * useDataSync
 * 
 * Listens for real-time data change notifications broadcast by Server-Sent Events (SSE)
 * or local admin mutations across browser tabs and windows.
 * 
 * @param {string|string[]} entityTypes - Entity type(s) to subscribe to, e.g. 'vehicles', ['vehicles', 'tariffs'], or 'all'
 * @param {Function} refetchFn - Function called when a matching mutation occurs
 */
export function useDataSync(entityTypes, refetchFn) {
  const refetchRef = useRef(refetchFn);
  refetchRef.current = refetchFn;

  useEffect(() => {
    const types = Array.isArray(entityTypes) ? entityTypes : [entityTypes];

    const handleDataChange = (event) => {
      const { type } = event.detail || {};
      if (type === 'all' || types.includes('all') || types.includes(type)) {
        try {
          if (typeof refetchRef.current === 'function') {
            refetchRef.current();
          }
        } catch (e) {
          console.error('[useDataSync] Refetch error:', e);
        }
      }
    };

    window.addEventListener('ft:data-change', handleDataChange);
    return () => {
      window.removeEventListener('ft:data-change', handleDataChange);
    };
  }, [JSON.stringify(entityTypes)]);
}

export default useDataSync;
