import { useEffect, useRef } from 'react';

/**
 * useDataSync
 * 
 * Listens for real-time data change notifications broadcast by Server-Sent Events (SSE),
 * BroadcastChannel, localStorage storage events, or window focus.
 * 
 * @param {string|string[]} entityTypes - Entity type(s) to subscribe to, e.g. 'vehicles', ['vehicles', 'services'], or 'all'
 * @param {Function} refetchFn - Function called when a matching mutation occurs
 */
export function useDataSync(entityTypes, refetchFn) {
  const refetchRef = useRef(refetchFn);
  refetchRef.current = refetchFn;

  useEffect(() => {
    const types = Array.isArray(entityTypes) ? entityTypes : [entityTypes];

    const triggerRefetch = () => {
      try {
        if (typeof refetchRef.current === 'function') {
          refetchRef.current();
        }
      } catch (e) {
        console.error('[useDataSync] Refetch error:', e);
      }
    };

    const handlePayload = (payload) => {
      const type = payload?.type;
      if (!type || type === 'all' || types.includes('all') || types.includes(type)) {
        triggerRefetch();
      }
    };

    // 1. Same-window custom event
    const handleCustomEvent = (event) => {
      handlePayload(event.detail);
    };
    window.addEventListener('ft:data-change', handleCustomEvent);

    // 2. Cross-tab BroadcastChannel
    let channel = null;
    if (typeof window !== 'undefined' && typeof window.BroadcastChannel === 'function') {
      try {
        channel = new BroadcastChannel('ft_sync_channel');
        channel.onmessage = (e) => handlePayload(e.data);
      } catch (_) {}
    }

    // 3. Cross-tab localStorage storage event
    const handleStorage = (e) => {
      if (e.key === 'ft_last_mutation' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handlePayload(parsed);
        } catch (_) {
          triggerRefetch();
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    // 4. Window focus & tab visibility refetch (refetches when user switches from Admin to Website tab)
    const handleFocus = () => {
      triggerRefetch();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        triggerRefetch();
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('ft:data-change', handleCustomEvent);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (channel) {
        try {
          channel.close();
        } catch (_) {}
      }
    };
  }, [JSON.stringify(entityTypes)]);
}

export default useDataSync;
