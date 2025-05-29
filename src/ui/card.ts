import { tags } from "@/lib/ima";
import { addGlobalStyles, css } from "@/lib/utils";

const { div } = tags;

export function Card(props: {}, ...children: any) {
	return div({ class: "card", ...props }, ...children);
}

addGlobalStyles(css`
	.card {
		border: 1px solid #ffffff20;
		border-radius: var(--size-3);
		padding: var(--size-4);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		background-color: #ffffff60;
		backdrop-filter: blur(20px);
	}
`);
