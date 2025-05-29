import { tags, reactive, debug, start_render_measurement } from "@/lib/ima";
import { addGlobalStyles, css, repeat } from "./lib/utils";

const { main, header, div, section, footer, h1, p, icon, button, span, pre } = tags;

let count = 0;
let debug_info = { ...debug() };

setInterval(() => {
	debug_info = { ...debug() };
}, 500);

// Debug Display Component
const PerformanceDisplay = reactive(() => {
	return pre(
		{ style: "position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 5px;" },
		JSON.stringify(debug_info, null, 2),
	);
});

const app = main(
	header("A tiny immediate-mode UI rendering engine by fergarram"),
	h1(
		{
			style: () => css`
				transition: ease 200ms all;
				transform: rotate(${count}deg);
			`,
		},
		"IMA (今)",
	),
	PerformanceDisplay,
	div(
		{
			id: "grid",
		},
		...repeat(1000, null).map((_, i) => {
			return section(
				span(() => count),
				// reactive(() => p(count)),
				button(
					{
						variant: "default",
						onclick() {
							console.log("Button clicked!", i);
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
	footer(`Copyright © ${new Date().getFullYear()} IMA. All rights reserved.`),
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
