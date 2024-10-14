# useSafeCallback

A friendlier, faster, less risky useCallback. It returns a stable reference without needing a dependency array.

- Memory safe, old closures are not retained.
- No dependency array is required.
- The callback can even be passed outside of react.

## Basic Usage

```ts
import { useSafeCallback } from 'use-safe-callback';

const MyComponent = () => {

	const [count, setCount] = useState(0);

	const incrementState = useSafeCallback(() => {
		// you will always have the current value of variables.
		setCount(count+1)
	});

	return (<div>
		{count}
		<button onClick={incrementState}>increment state</button>
	</div>)
}
```

## Memory Safety

In JavaScript, as long as a function is in memory, all the variables in its containing closure are also retained. This means that using `useCallback`, and `useEffect` can easily create memory leaks because they hold on to the entire state of your component when they were calculated. This problem can be compounded by memoized data and other callbacks. See this article: https://www.schiener.io/2024-03-03/react-closures for further detail.

## Stable References

Because `useCallback` returns a new reference when its dependency array changes, child components may re-render unnecessisarilly, or trigger unwanted side effeccts.

With `useSafeCallback`, you get a single reference that will remain stable throughout the life of your component. It will always call the most recent version of your function, using your variables in their latest state.

