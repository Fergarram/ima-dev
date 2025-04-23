//
// IMUI 1.0.0
// by fergarram
//

// A lightweight system immediate-mode rendering of HTML interfaces.

//
// Index:
//

// — Core Types
// — DOM Element Generation
// — Reactive System

//
// Core Types
//

export type props = {
	is?: string;
	[key: string]: any;
};

export type tag_function = (
	props?: props | string | number | null | undefined | boolean | HTMLElement,
	...children: (HTMLElement | null | undefined | string | boolean | number)[]
) => HTMLElement;

export type tags_proxy = {
	[key: string]: tag_function;
} & ((ns?: string) => tags_proxy);

//
// DOM Element Generation
//

// Unique ID generator for elements with reactive content
const generate_element_id = (() => {
	let counter = 0;
	return () => counter++;
})();

export const tag_generator =
	(_: any, name: string): tag_function =>
	(...args: any[]): HTMLElement => {
		let props_obj: props = {};
		let children: (HTMLElement | string | number)[] = args;

		if (args.length > 0) {
			const first_arg = args[0];

			// If first argument is a string, number, or HTMLElement, all args are children
			if (typeof first_arg === "string" || typeof first_arg === "number" || first_arg instanceof HTMLElement) {
				children = args;
			}
			// If first argument is a plain object, treat it as props
			else if (Object.getPrototypeOf(first_arg ?? 0) === Object.prototype) {
				const [props_arg, ...rest_args] = args;
				const { is, ...rest_props } = props_arg;
				props_obj = rest_props;
				children = rest_args;
			}
		}

		// Create the element (with namespace if needed)
		const element = document.createElement(name);

		// Handle props/attributes
		for (const [key, value] of Object.entries(props_obj)) {
			// Event handlers
			if (key.startsWith("on") && typeof value === "function") {
				const event_name = key.substring(2).toLowerCase(); // e.g., "onClick" -> "click"
				element.addEventListener(event_name, value as EventListener);
				continue;
			}

			// Reactive attributes (functions that don't start with "on")
			if (typeof value === "function" && !key.startsWith("on")) {
				register_reactive_attr(element, key, value);
				continue;
			}

			// Regular attributes
			if (value === true) {
				element.setAttribute(key, "");
			} else if (value !== false && value != null) {
				element.setAttribute(key, String(value));
			}
		}

		// Process children and append to element
		for (const child of children.flat(Infinity)) {
			if (child != null) {
				if (child instanceof HTMLElement) {
					element.appendChild(child);
				} else {
					element.appendChild(document.createTextNode(String(child)));
				}
			}
		}

		return element;
	};

export const tags: tags_proxy = new Proxy({}, { get: tag_generator });

//
// Reactive System
//

// SOA (Structure of Arrays) approach for reactive components
const reactive_elements: HTMLElement[] = [];
const reactive_callbacks: Array<() => HTMLElement> = [];
const reactive_html_cache: string[] = [];
const reactive_count = { value: 0 };

// New structures for reactive attributes
const reactive_attr_elements: HTMLElement[] = [];
const reactive_attr_names: string[] = [];
const reactive_attr_callbacks: Array<() => any> = [];
const reactive_attr_prev_values: any[] = [];
const reactive_attr_count = { value: 0 };

const performance_data = {
	components_updated: 0,
	component_count: 0,
	attributes_updated: 0,
	attribute_count: 0,
	frame_ms: 0,
	rerender_start_time: 0,
	rerender_end_time: 0,
	total_rerender_time: 0,
	is_measuring: false,
};

let animation_frame_requested = false;

export function debug() {
	return performance_data;
}

export function start_render_measurement() {
	performance_data.rerender_start_time = performance.now();
	performance_data.is_measuring = true;
	performance_data.total_rerender_time = 0;
}

export function end_render_measurement() {
	if (performance_data.is_measuring) {
		performance_data.rerender_end_time = performance.now();
		performance_data.total_rerender_time = performance_data.rerender_end_time - performance_data.rerender_start_time;
		performance_data.is_measuring = false;
		console.log(`Total rerender time: ${performance_data.total_rerender_time.toFixed(2)}ms`);
	}
}

function update_reactive_components() {
	animation_frame_requested = false;

	const start_time = performance.now();
	let components_updated = 0;
	let attributes_updated = 0;

	// Update all reactive attributes first
	for (let i = 0; i < reactive_attr_count.value; i++) {
		const element = reactive_attr_elements[i];
		const attr_name = reactive_attr_names[i];
		const callback = reactive_attr_callbacks[i];

		// Only proceed if the element is still in the DOM
		if (!element.isConnected) continue;

		const new_value = callback();

		// Only update if the value has changed
		if (new_value !== reactive_attr_prev_values[i]) {
			if (new_value === true) {
				element.setAttribute(attr_name, "");
			} else if (new_value === false || new_value == null) {
				element.removeAttribute(attr_name);
			} else {
				element.setAttribute(attr_name, String(new_value));
			}

			reactive_attr_prev_values[i] = new_value;
			attributes_updated++;
		}
	}

	// Update all elements in all components
	for (let i = 0; i < reactive_count.value; i++) {
		const new_element = reactive_callbacks[i]();
		const new_html = new_element.outerHTML;

		// Only replace if the HTML content has actually changed
		if (new_html !== reactive_html_cache[i]) {
			reactive_elements[i].replaceWith(new_element);
			reactive_elements[i] = new_element;
			reactive_html_cache[i] = new_html;
			components_updated++;
		}
	}

	const end_time = performance.now();
	const duration_ms = end_time - start_time;

	// Update performance data
	performance_data.components_updated = components_updated;
	performance_data.component_count = reactive_count.value;
	performance_data.attributes_updated = attributes_updated;
	performance_data.attribute_count = reactive_attr_count.value;
	performance_data.frame_ms = duration_ms;

	// End measurement if all components are updated and we're measuring
	if (performance_data.is_measuring && components_updated === 0 && attributes_updated === 0) {
		end_render_measurement();
	}

	// Request next frame if there are still components or reactive attributes
	if (reactive_count.value > 0 || reactive_attr_count.value > 0) {
		request_animation_frame();
	}
}

function request_animation_frame() {
	if (!animation_frame_requested && (reactive_count.value > 0 || reactive_attr_count.value > 0)) {
		animation_frame_requested = true;
		requestAnimationFrame(update_reactive_components);
	}
}

export function reactive(callback: () => HTMLElement): HTMLElement {
	// Generate a unique ID for this reactive component
	const component_index = generate_element_id();

	// Create the initial element
	const element = callback();
	const html = element.outerHTML;

	// Store component data in our parallel arrays
	reactive_elements[component_index] = element;
	reactive_callbacks[component_index] = callback;
	reactive_html_cache[component_index] = html;
	reactive_count.value++;

	// Start the animation frame loop
	request_animation_frame();

	return element;
}

// New function to register a reactive attribute
function register_reactive_attr(element: HTMLElement, attr_name: string, callback: () => any) {
	const attr_index = reactive_attr_count.value;

	// Initialize with current value
	const initial_value = callback();

	// Set the initial attribute value
	if (initial_value === true) {
		element.setAttribute(attr_name, "");
	} else if (initial_value !== false && initial_value != null) {
		element.setAttribute(attr_name, String(initial_value));
	}

	// Store data in our parallel arrays
	reactive_attr_elements[attr_index] = element;
	reactive_attr_names[attr_index] = attr_name;
	reactive_attr_callbacks[attr_index] = callback;
	reactive_attr_prev_values[attr_index] = initial_value;
	reactive_attr_count.value++;

	// Start the animation frame loop
	request_animation_frame();
}
