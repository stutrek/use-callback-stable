import { useCallback, useRef } from 'react';

/**
 * Hook that returns a stable callback function which always invokes the latest version of the provided callback.
 * This eliminates the need for a dependency array and helps prevent memory leaks caused by stale closures.
 *
 * @typeParam T - A tuple representing the argument types of the callback function.
 * @typeParam U - The return type of the callback function.
 * @param {(...args: T) => U} callback - The callback function to be stabilized.
 * @returns {(...args: T) => U} A stable callback function that always calls the latest version of the provided callback.
 *
 * @see {@link https://www.schiener.io/2024-03-03/react-closures}
 */
export function useSafeCallback<T extends any[], U>(
    callback: (...args: T) => U,
): (...args: T) => U {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    return useCallback((...args: T) => callbackRef.current(...args), []);
}
