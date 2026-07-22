// Polyfill for environments (e.g. sandboxed iframe or strict window objects)
// where window.fetch has only a getter without a setter, causing
// "Cannot set property fetch of #<Window> which has only a getter" errors.

if (typeof window !== 'undefined') {
  (function () {
    try {
      const _nativeFetch =
        typeof window.fetch === 'function' ? window.fetch.bind(window) : undefined;
      let _customFetch: typeof window.fetch | undefined = undefined;

      const getFetch = function () {
        return _customFetch || _nativeFetch || window.fetch;
      };

      const setFetch = function (fn: any) {
        if (typeof fn === 'function') {
          _customFetch = fn;
        }
      };

      // 1. Try patching Window.prototype first so all window instances inherit getter & setter
      const proto = typeof Window !== 'undefined' ? Window.prototype : Object.getPrototypeOf(window);
      if (proto) {
        try {
          const desc = Object.getOwnPropertyDescriptor(proto, 'fetch');
          if (!desc || desc.configurable !== false) {
            Object.defineProperty(proto, 'fetch', {
              get: getFetch,
              set: setFetch,
              configurable: true,
              enumerable: true,
            });
          }
        } catch (e) {
          // Ignore
        }
      }

      // 2. Patch window, globalThis, self
      const targets: any[] = [
        window,
        typeof globalThis !== 'undefined' ? globalThis : null,
        typeof self !== 'undefined' ? self : null,
      ];

      for (const target of targets) {
        if (!target) continue;
        try {
          const desc = Object.getOwnPropertyDescriptor(target, 'fetch');
          if (desc && desc.configurable === false) continue;

          Object.defineProperty(target, 'fetch', {
            get: getFetch,
            set: setFetch,
            configurable: true,
            enumerable: true,
          });
        } catch (e) {
          // Fallback if getter/setter define fails
          try {
            target.fetch = getFetch();
          } catch (err) {
            // Ignore
          }
        }
      }
    } catch (err) {
      // Ignore polyfill errors
    }
  })();
}

export {};


