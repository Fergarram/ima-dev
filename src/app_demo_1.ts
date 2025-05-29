import { useTags } from "@/lib/ima";
import { css, addGlobalStyles, throttle } from "./lib/utils";

const { div, main, header, section, footer, h1, h2, p, button, input, label, span } = useTags();

// State
let count = 0;
let color = "#8b5cf6"; // Default color (purple-500)
let isDarkMode = true;
let multiplication_factor = 2;

// Create a reactive counter value that changes color based on the value
const counter_display = () => {
	return reactive(() => {
		const value_color = count > 10 ? "var(--color-green-500)" : count < 0 ? "var(--color-red-500)" : color;

		return span(
			{
				class: "counter-value",
				style: css`
					color: ${value_color};
				`,
			},
			count,
		);
	});
};

// Reactive color preview
const color_preview = () => {
	return reactive(() =>
		div({
			class: "color-preview",
			style: css`
				background-color: ${color};
			`,
		}),
	);
};

// Reactive stats
const stats_display = () => {
	return reactive(() =>
		div(
			{ class: "stats-display" },
			div(
				{ class: "stat-card" },
				div({ class: "stat-value" }, `${count * multiplication_factor}`),
				div({ class: "stat-label" }, `Count × ${multiplication_factor}`),
			),
			div(
				{
					class: "stat-card",
					style: css`
						background-color: ${count < 0 ? "var(--color-red-900)" : "var(--color-green-900)"};
					`,
				},
				div({ class: "stat-value" }, count >= 0 ? "Positive" : "Negative"),
				div({ class: "stat-label" }, "Status"),
			),
		),
	);
};

// Theme toggle button
const theme_toggle_text = () => {
	return reactive(() => span(isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"));
};

// Create the main app
const app = main(
	{ class: "app-container" },

	// Header
	header(
		{ class: "app-header" },
		h1({ class: "app-title" }, "IMA Demo"),
		p({ class: "app-subtitle" }, "A lightweight system for immediate-mode rendering of HTML interfaces"),
	),

	// Counter card
	section(
		{ class: "card counter-section" },
		h2("Interactive Counter"),
		counter_display(),
		div(
			{ class: "counter-controls" },
			button(
				{
					variant: "default",
					onclick: () => {
						count -= 1;
					},
				},
				"Decrease",
			),
			button(
				{
					variant: "default",
					onclick: () => {
						count = 0;
					},
				},
				"Reset",
			),
			button(
				{
					variant: "default",
					onclick: () => {
						count += 1;
					},
				},
				"Increase",
			),
		),
		stats_display(),
	),

	// Color picker card
	section(
		{ class: "card" },
		h2("Color Customizer"),
		div(
			{ class: "color-picker" },
			color_preview(),
			label(
				"Choose accent color: ",
				input({
					type: "color",
					value: color,
					oninput: (e) => {
						color = (e.target as HTMLInputElement).value;
						// Update document stylesheet with new color
						document.documentElement.style.setProperty("--accent-color", color);
					},
				}),
			),
		),
		div(
			{ class: "theme-toggle" },
			span("Multiplication Factor: "),
			input({
				type: "range",
				min: "1",
				max: "10",
				value: multiplication_factor,
				oninput: throttle((e) => {
					multiplication_factor = parseInt(e.target.value);
				}, 100),
			}),
			reactive(() => span(multiplication_factor)),
		),
	),

	// Theme toggle
	section(
		{ class: "card" },
		h2("App Settings"),
		button(
			{
				variant: "default",
				onclick: () => {
					isDarkMode = !isDarkMode;
					if (isDarkMode) {
						document.body.classList.remove("light-mode");
					} else {
						document.body.classList.add("light-mode");
					}
				},
			},
			theme_toggle_text(),
		),
	),

	// Footer
	footer({ class: "app-footer" }, "Built with IMA © 2023 - Watch elements update reactively!"),
);

// Mount the app to the document body
document.body.appendChild(app);

// Add global styles
addGlobalStyles(css`
	body {
		font-family: var(--font-sans);
		background: var(--color-slate-950);
		color: var(--color-white);
		overflow-x: hidden;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	body.light-mode {
		background: var(--color-slate-100);
		color: var(--color-slate-900);
	}

	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		max-width: var(--size-160);
		margin: 0 auto;
		padding: var(--size-4);
	}

	.app-header {
		padding: var(--size-6) 0;
		text-align: center;
		position: relative;
		border-bottom: 1px solid var(--color-slate-800);
		margin-bottom: var(--size-6);
		transition: border-color 0.3s ease;
	}

	body.light-mode .app-header {
		border-bottom: 1px solid var(--color-slate-300);
	}

	.app-title {
		font-size: var(--size-8);
		font-weight: var(--font-bold);
		background: linear-gradient(to right, var(--color-blue-400), var(--color-purple-400));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		margin-bottom: var(--size-2);
	}

	.app-subtitle {
		color: var(--color-slate-400);
		font-size: var(--size-4);
		max-width: var(--size-104);
		margin: 0 auto;
		transition: color 0.3s ease;
	}

	body.light-mode .app-subtitle {
		color: var(--color-slate-600);
	}

	.card {
		background: var(--color-slate-900);
		border-radius: var(--size-2);
		padding: var(--size-6);
		margin-bottom: var(--size-4);
		box-shadow: var(--fast-thickness-1);
		border: 1px solid var(--color-slate-800);
		transition:
			transform 0.3s var(--ease-out),
			box-shadow 0.3s var(--ease-out),
			background-color 0.3s ease,
			border-color 0.3s ease;
	}

	body.light-mode .card {
		background: var(--color-white);
		border-color: var(--color-slate-200);
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: var(--fast-elevation-1);
		border-color: var(--color-slate-700);
	}

	body.light-mode .card:hover {
		border-color: var(--color-slate-300);
	}

	.counter-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--size-4);
	}

	.counter-value {
		font-size: var(--size-9);
		font-weight: var(--font-bold);
		font-family: var(--font-mono);
		transition: color 0.3s ease;
	}

	.counter-controls {
		display: flex;
		gap: var(--size-2);
	}

	body.light-mode button[variant="default"] {
		background-color: var(--color-slate-800);
	}

	body.light-mode button[variant="default"]:hover {
		background-color: var(--color-slate-700);
	}

	.app-footer {
		margin-top: auto;
		padding: var(--size-4) 0;
		text-align: center;
		color: var(--color-slate-500);
		font-size: var(--size-3);
		border-top: 1px solid var(--color-slate-800);
		transition:
			border-color 0.3s ease,
			color 0.3s ease;
	}

	body.light-mode .app-footer {
		border-top: 1px solid var(--color-slate-300);
		color: var(--color-slate-600);
	}

	.color-picker {
		display: flex;
		align-items: center;
		gap: var(--size-3);
		margin-top: var(--size-4);
	}

	.color-preview {
		width: var(--size-10);
		height: var(--size-10);
		border-radius: var(--size-1);
		border: 1px solid var(--color-slate-700);
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}

	body.light-mode .color-preview {
		border-color: var(--color-slate-300);
	}

	.color-indicator {
		display: inline-block;
		width: var(--size-3);
		height: var(--size-3);
		border-radius: 50%;
		margin-right: var(--size-1);
		vertical-align: middle;
	}

	.theme-toggle {
		margin-top: var(--size-4);
		display: flex;
		align-items: center;
		gap: var(--size-2);
	}

	.stats-display {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--size-4);
		margin-top: var(--size-4);
		width: 100%;
	}

	.stat-card {
		background: var(--color-slate-800);
		border-radius: var(--size-1);
		padding: var(--size-4);
		text-align: center;
		transition: background-color 0.3s ease;
	}

	body.light-mode .stat-card {
		background: var(--color-slate-200);
	}

	body.light-mode .stat-card[style*="background-color: var(--color-red-900)"] {
		background-color: var(--color-red-100) !important;
	}

	body.light-mode .stat-card[style*="background-color: var(--color-green-900)"] {
		background-color: var(--color-green-100) !important;
	}

	.stat-value {
		font-size: var(--size-5);
		font-weight: var(--font-bold);
		margin-bottom: var(--size-1);
	}

	.stat-label {
		font-size: var(--size-3);
		color: var(--color-slate-400);
		transition: color 0.3s ease;
	}

	body.light-mode .stat-label {
		color: var(--color-slate-600);
	}

	/* Slider styles for light mode */
	body.light-mode input[type="range"] {
		background-color: var(--color-slate-300);
	}

	body.light-mode input[type="range"]::-webkit-slider-thumb {
		background-color: var(--color-blue-500);
	}

	body.light-mode input[type="range"]::-moz-range-thumb {
		background-color: var(--color-blue-500);
	}
`);
