# useSafeCallback

A friendlier, faster, and safer alternative to useCallback. It returns a stable function reference without needing a dependency array.

- **Memory Safe**: Old closures are not retained, preventing potential memory leaks.
- **No Dependency Array Required**: Simplifies code by eliminating the need for dependency arrays.
- **Versatile**: The callback can even be passed outside of React components.

## Installation

```bash
npm install use-safe-callback
yarn add use-safe-callback
```
## Basic Usage

```ts
import React, { useState } from 'react';
import { useSafeCallback } from 'use-safe-callback';

const MyComponent = () => {
    const [count, setCount] = useState(0);

    const incrementState = useSafeCallback(() => {
        // You will always have the current value of variables.
        setCount(count + 1);
    });

    return (
        <div>
            <p>{count}</p>
            <button onClick={incrementState}>Increment State</button>
        </div>
    );
};
```
With useSafeCallback, you can be confident that your callback always has access to the latest state and props, and you won’t need to worry about dependency arrays or stale closures.

## Memory Safety

In JavaScript, as long as a function is in memory, all the variables in its containing closure are also retained. This means that using useCallback and useEffect can inadvertently create memory leaks because they hold onto the entire state of your component at the time they were created. This problem can be compounded by memoized data and other callbacks.

By using useSafeCallback, you avoid retaining old closures, as it always references the latest version of your callback function. This leads to improved memory usage and prevents potential memory leaks.

For further details, see this article: [﻿React Closures and Memory Leaks](https://www.schiener.io/2024-03-03/react-closures).

## Stable References

Because `useCallback` returns a new function reference whenever its dependency array changes, child components may re-render unnecessarily or trigger unwanted side effects.

With `useSafeCallback`, you get a single function reference that remains stable throughout the life of your component. It will always call the most recent version of your function, using your variables in their latest state. This helps prevent unnecessary re-renders and side effects in child components that depend on the callback.

## How It Works

```ts
import { useCallback, useRef } from 'react';

function useSafeCallback<T extends any[], U>(callback: (...args: T) => U): (...args: T) => U {
    const callbackRef = useRef(callback);

    // Update the ref to the latest callback on each render
    callbackRef.current = callback;

    // Return a stable callback function
    return useCallback((...args: T) => {
        return callbackRef.current(...args);
    }, []);
}
```


