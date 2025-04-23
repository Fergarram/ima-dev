import { tags, reactive, debug, start_render_measurement, end_render_measurement } from "@/lib/imui";
import { addGlobalStyles, css, repeat } from "./lib/utils";

const { main, header, div, section, footer, h1, p, icon, button, span } = tags;

let count = 0;
let debug_info = { ...debug() };

setInterval(() => {
	debug_info = { ...debug() };
}, 500);

// Add a performance display element
const performance_display = reactive(() => {
	return div(
		{ style: "position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 5px;" },
		p(`Components: ${debug_info.component_count}`),
		p(`Last frame: ${debug_info.frame_ms.toFixed(2)}ms`),
		p(`Updated: ${debug_info.components_updated}`),
		p(`Total render time: ${debug_info.total_rerender_time.toFixed(2)}ms`),
	);
});

const app = main(
	header("Welcome to the IMUI App!"),
	h1(
		{
			style: () => css`
				transition: ease 200ms all;
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
		...repeat(100, null).map((_, i) => {
			return section(
				span(() => count),
				// reactive(() => p(count)),
				button(
					{
						variant: "default",
						onclick() {
							console.log("Button clicked!", i);
							// Start measurement before changing state
							start_render_measurement();
							count += i + 1;
						},
					},
					`Add ${i + 1}`,
					icon({
						name: "add",
					}),
				),
			);
		}),
	),
	footer("Copyright © 2023 IMUI. All rights reserved."),
);

document.body.appendChild(app);

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
