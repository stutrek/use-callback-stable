import { renderHook, act } from '@testing-library/react';
import { useCallbackStable } from '../index'; // Adjust the import path accordingly
import { useState } from 'react';

describe('useCallbackStable', () => {
    it('returns a stable function reference across renders', () => {
        const callback = jest.fn();
        const { result, rerender } = renderHook(() =>
            useCallbackStable(callback),
        );

        const firstCallbackRef = result.current;

        rerender();

        expect(result.current).toBe(firstCallbackRef);
    });

    it('always calls the latest version of the callback', () => {
        const initialCallback = jest.fn();
        const updatedCallback = jest.fn();

        const { result, rerender } = renderHook(
            ({ cb }) => useCallbackStable(cb),
            { initialProps: { cb: initialCallback } },
        );

        act(() => {
            result.current();
        });
        expect(initialCallback).toHaveBeenCalledTimes(1);
        expect(updatedCallback).toHaveBeenCalledTimes(0);

        // Update the callback
        rerender({ cb: updatedCallback });

        act(() => {
            result.current();
        });
        expect(initialCallback).toHaveBeenCalledTimes(1);
        expect(updatedCallback).toHaveBeenCalledTimes(1);
    });

    it('correctly passes arguments and returns values', () => {
        const callback = jest.fn((a: number, b: number) => a + b);
        const { result } = renderHook(() => useCallbackStable(callback));

        const returnValue = result.current(2, 3);

        expect(callback).toHaveBeenCalledWith(2, 3);
        expect(returnValue).toBe(5);
    });

    it('works correctly with changing dependencies', () => {
        const { result, rerender } = renderHook(
            ({ value }) => {
                const [state, setState] = useState(value);
                const callback = useCallbackStable(() => state);
                return { callback, setState };
            },
            { initialProps: { value: 0 } },
        );

        expect(result.current.callback()).toBe(0);

        act(() => {
            result.current.setState(10);
        });

        expect(result.current.callback()).toBe(10);
    });
});
