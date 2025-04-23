/**
 * Returns a promise that resolves when the window has completely loaded
 * Useful for ensuring all resources have loaded before performing operations
 */
export function documentReady(): Promise<void> {
	return new Promise((resolve) => {
		// If document is already loaded, resolve immediately
		if (document.readyState === "complete") {
			resolve();
			return;
		}

		// Otherwise, wait for the load event
		window.addEventListener(
			"load",
			() => {
				// Add a small delay to ensure any post-load scripts have executed
				setTimeout(() => {
					resolve();
				}, 50);
			},
			{ once: true },
		);
	});
}

/**
 * Fades a color variable by mixing it with transparency
 */
export function fade(color: string, opacity: number): string {
	return `color-mix(in oklch, var(${color}), transparent ${100 - opacity}%)`;
}

/**
 * Executes a function and returns a tuple of [result, error]
 */
export async function tryCatch<T>(func: () => T | Promise<T>): Promise<[T | null, Error | null]> {
	try {
		const result = func();
		// Check if the result is a promise
		if (result instanceof Promise) {
			return [await result, null];
		}
		return [result as T, null];
	} catch (error) {
		return [null, error as Error];
	}
}

/**
 * Checks if an element is scrollable
 */
export function isScrollable(element: HTMLElement | null): boolean {
	if (!element) return false;
	const style = window.getComputedStyle(element);
	const overflowY = style.getPropertyValue("overflow-y");
	const overflowX = style.getPropertyValue("overflow-x");
	return (
		(overflowY === "scroll" || overflowY === "auto" || overflowX === "scroll" || overflowX === "auto") &&
		(element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)
	);
}

/**
 * Creates a global stylesheet with the provided styles
 */
export function addGlobalStyles(styles: string): void {
	// Create a new style element instead of using CSSStyleSheet API
	const style_element = document.createElement("style");
	style_element.textContent = styles;

	// Append to document head
	document.head.appendChild(style_element);
}

/**
 * Creates an array of specified length filled with a value
 */
export function repeat<T>(length: number, val: T): T[] {
	return Array.from({ length }, () => val);
}

/**
 * Creates a throttled function that only executes once within the wait period
 */
export function throttle<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
	let waiting = false;
	return function (this: any, ...args: Parameters<T>): void {
		if (!waiting) {
			func.apply(this, args);
			waiting = true;
			setTimeout(() => (waiting = false), wait);
		}
	};
}

/**
 * Creates a promise that resolves after the specified time
 */
export function finish(time: number = 0): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Template literal tag for CSS strings
 */
export function css(strings: TemplateStringsArray, ...values: any[]): string {
	return strings.reduce((result, str, i) => result + str + (i < values.length ? values[i] : ""), "");
}

/**
 * Template literal tag for HTML strings
 */
export function html(strings: TemplateStringsArray, ...values: any[]): string {
	return strings.reduce((result, str, i) => result + str + (i < values.length ? values[i] : ""), "");
}
