// Polyfill for environments (e.g. sandboxed iframe or strict window objects)
// where window.fetch has only a getter without a setter, causing
// "Cannot set property fetch of #<Window> which has only a getter" errors.

if (typeof window !== 'undefined') {
  try {
    const origFetch = typeof window.fetch === 'function' ? window.fetch.bind(window) : undefined;

    const rawTargets: any[] = [
      window,
      typeof globalThis !== 'undefined' ? globalThis : null,
      typeof self !== 'undefined' ? self : null,
      typeof Window !== 'undefined' ? Window.prototype : null,
    ];

    for (const target of rawTargets) {
      if (!target) continue;
      try {
        Object.defineProperty(target, 'fetch', {
          value: origFetch,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      } catch (e) {
        // Ignore if non-configurable
      }
    }
  } catch (err) {
    // Ignore polyfill errors
  }
}

export {};
