import { tags } from "@/lib/ima";
import { addGlobalStyles, css, finish, repeat } from "@/lib/utils";
import { Card } from "./ui/card";
import { Loader } from "@googlemaps/js-api-loader";

const API_KEY = "AIzaSyCWrJsIzMFjT-KmelNDkt9BzLt3e5qXwZ8";
const FIREBASE_API_KEY = "AIzaSyCWrJsIzMFjT-KmelNDkt9BzLt3e5qXwZ8";
const FIREBASE_APP_ID = "1:100616328741:web:074136760df8d9228b91cc";
const FIREBASE_MEASUREMENT_ID = "G-ZJ5D8RRGR2";
const FIREBASE_MESSAGING_SENDER_ID = "100616328741";
const FIREBASE_PROJECT_ID = "geoguessr-lucifer";

const { main, div, p, button } = tags;

// Create the containers
const mapEl = div({
	style: css`
		width: var(--size-64);
		height: var(--size-64);
	`,
});

const mapContainer = div(
	{
		style: css`
			position: fixed;
			bottom: 0;
			left: 0;
			width: var(--size-64);
			height: var(--size-64);
			z-index: 10000;
		`,
	},
	mapEl,
);

const streetViewContainer = div({
	style: css`
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	`,
});

const gui = div({
	style: css`
		display: contents;
	`,
});

// Mount App
const app = main(streetViewContainer, mapContainer, gui);
document.body.appendChild(app);

await finish();

// Initialize Google Maps using the Loader
const loader = new Loader({
	apiKey: API_KEY,
	version: "weekly",
});

// Load the Google Maps API
const GMaps = await loader.importLibrary("maps");
const GStreetView = await loader.importLibrary("streetView");

// Initialize map and street view
const sanFrancisco = { lat: 37.774, lng: -122.419 };

// Initialize the map
const map = new GMaps.Map(mapEl, {
	center: sanFrancisco,
	zoom: 14,
	disableDefaultUI: true,
});

// Initialize Street View
const panorama = new GStreetView.StreetViewPanorama(streetViewContainer, {
	position: sanFrancisco,
	pov: {
		heading: 34,
		pitch: 10,
	},
	disableDefaultUI: true,
	zoomControl: false,
	showRoadLabels: false,
});

// Build the UI
gui.appendChild(
	Card(
		{
			style: css`
				display: flex;
				flex-direction: column;
				gap: var(--size-3);
				position: fixed;
				right: var(--size-4);
				top: var(--size-4);
				width: var(--size-64);
				z-index: 10000;
			`,
		},
		p(() => `Zoom: ${map.getZoom()}`),
	),
);

// Add App Styles
addGlobalStyles(css`
	html {
		color: black;
		background-color: white;
	}

	main {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	/* Add this for responsive layout */
	@media (max-width: 768px) {
		[style*="width: 50%"] {
			width: 100% !important;
			height: 50% !important;
			float: none !important;
		}
	}
`);
