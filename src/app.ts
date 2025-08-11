import { useTags, getFrameTime } from "@/lib/ima";
import { addGlobalStyles, css, repeat } from "./lib/utils";

const { main, header, div, section, footer, h1, p, button, span } = useTags();

const MAXCOMP = 20000;

let count = 0;
let last_max = 0;

const app = main(
	header("Welcome to the IMA App!"),
	span(() => {
		last_max = Math.max(getFrameTime(), last_max);
		return last_max;
	}),
	h1(
		{
			style: () => css`
				transform: rotate(${count}deg);
				transition: ease 250ms all;
			`,
		},
		"IMA",
	),
	div(
		{
			id: "grid",
		},
		...repeat(MAXCOMP, null).map((_, i) => {
			return section(
				span(() => count),
				button(
					{
						variant: "default",
						onclick() {
							console.log("Button clicked!", i);
							count += i + 1;
						},
					},
					`Add ${i + 1}`,
				),
			);
		}),
	),
	footer("Copyright © 2023 IMA. All rights reserved."),
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
