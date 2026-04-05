import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const ok  = useCallback(msg => add(msg, 'ok'),   [add]);
  const err = useCallback(msg => add(msg, 'err'),  [add]);
  const info= useCallback(msg => add(msg, 'info'), [add]);

  return { toasts, ok, err, info };
}
