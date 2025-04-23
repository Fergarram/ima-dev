import { tags, reactive, debug, start_render_measurement, end_render_measurement } from "@/lib/imui";
import { addGlobalStyles, css, repeat } from "./lib/utils";

const { main, header, div, section, footer, h1, p, button, span } = tags;

let count = 0;

// Add a performance display element
const performance_display = reactive(() => {
	const perf = debug();
	return div(
		{ style: "position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 5px;" },
		p(`Components: ${perf.component_count}`),
		// p(`Last frame: ${perf.frame_ms.toFixed(2)}ms`),
		// p(`Updated: ${perf.components_updated}`),
		p(`Total render time: ${perf.total_rerender_time.toFixed(2)}ms`),
	);
});

const app = main(
	header("Welcome to the IMUI App!"),
	h1(
		{
			style: () => css`
				transform: rotate(${count}deg);
			`,
		},
		"IMUI",
	),
	performance_display, // Add performance display
	div(
		{
			id: "grid",
		},
		...repeat(20000, null).map((_, i) => {
			return section(
				span(() => count),
				button(
					{
						variant: "default",
						caca() {
							// test
						},
						oncaca() {
							console.log("caca");
						},
						onclick() {
							console.log("Button clicked!", i);
							// Start measurement before changing state
							start_render_measurement();
							count += i + 1;
						},
					},
					`Add ${i + 1}`,
				),
			);
		}),
	),
	footer("Copyright © 2023 IMUI. All rights reserved."),
);

document.body.appendChild(app);

// You don't need to call end_render_measurement() manually as it's
// handled in the update_reactive_components function when updates are complete

addGlobalStyles(css`
	html {
		background: black;
		color: white;
	}
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5rem;
	}

	#grid {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 1rem;
		padding: 2rem;
	}
`);
