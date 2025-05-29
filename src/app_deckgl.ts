import { tags } from "@/lib/ima";
import { addGlobalStyles, css, finish, repeat } from "@/lib/utils";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { BitmapLayer } from "@deck.gl/layers";
import { Map } from "maplibre-gl";
// @ts-ignore No idea why it's not being picked up
import maplibreStyles from "maplibre-gl/dist/maplibre-gl.css" with { type: "text" };
import { Card } from "./ui/card";

const { main, div, p, button } = tags;

//
// Layers
//

const layer = new BitmapLayer({
	id: "BitmapLayer",
	bounds: [-122.519, 37.7045, -122.355, 37.829],
	image: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png",
	pickable: true,
});

const geojsonData: GeoJSON.GeoJSON = {
	type: "FeatureCollection",
	features: [
		{
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [-122.414, 37.776],
			},
			properties: {
				title: "San Francisco Point",
				description: "A sample point in San Francisco",
			},
		},
		{
			type: "Feature",
			geometry: {
				type: "LineString",
				coordinates: [
					[-122.414, 37.776],
					[-122.45, 37.78],
					[-122.41, 37.8],
				],
			},
			properties: {
				title: "Sample Line",
				description: "A sample line in San Francisco",
			},
		},
		{
			type: "Feature",
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[-122.43, 37.75],
						[-122.45, 37.76],
						[-122.44, 37.78],
						[-122.42, 37.77],
						[-122.43, 37.75],
					],
				],
			},
			properties: {
				title: "Sample Polygon",
				description: "A sample polygon in San Francisco",
			},
		},
	],
};

//
// Initialize App
//

const mapContainer = div({
	style: css`
		position: relative;
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
const app = main(mapContainer, gui);
document.body.appendChild(app);

await finish();

//
// Initialize Maplibre
//

const map = new Map({
	container: mapContainer,
	style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
	center: [-122.4, 37.74],
	zoom: 11,
});

await map.once("load");

map.addSource("sample-geojson", {
	type: "geojson",
	data: geojsonData,
});

// Add a circle layer for Point features
map.addLayer({
	id: "sample-points",
	type: "circle",
	source: "sample-geojson",
	filter: ["==", "$type", "Point"],
	paint: {
		"circle-radius": 8,
		"circle-color": "#ff4000",
		"circle-stroke-width": 2,
		"circle-stroke-color": "#ffffff",
	},
});

// Add a line layer for LineString features
map.addLayer({
	id: "sample-lines",
	type: "line",
	source: "sample-geojson",
	filter: ["==", "$type", "LineString"],
	paint: {
		"line-color": "#0080ff",
		"line-width": 3,
	},
});

// Add a fill layer for Polygon features
map.addLayer({
	id: "sample-polygons-fill",
	type: "fill",
	source: "sample-geojson",
	filter: ["==", "$type", "Polygon"],
	paint: {
		"fill-color": "#00aa44",
		"fill-opacity": 0.6,
	},
});

// Add an outline layer for Polygon features
map.addLayer({
	id: "sample-polygons-outline",
	type: "line",
	source: "sample-geojson",
	filter: ["==", "$type", "Polygon"],
	paint: {
		"line-color": "#007722",
		"line-width": 2,
	},
});

//
// Initialize DeckGL
//

const deckOverlay = new MapboxOverlay({
	interleaved: true,
	layers: [layer],
});

map.addControl(deckOverlay);

let showBaseMap = true;

gui.appendChild(
	Card(
		{
			style: css`
				display: flex;
				flex-direction: column;
				gap: var(--size-3);
				position: absolute;
				right: var(--size-4);
				top: var(--size-4);
				width: var(--size-64);
			`,
		},
		p(() => map.getZoom()),
		button(
			{
				variant: "default",
				onClick() {
					// Get all style layers
					const layers = map.getStyle().layers || [];

					// Set opacity to 0 for all layers
					layers.forEach((layer) => {
						map.setLayoutProperty(layer.id, "visibility", !showBaseMap ? "visible" : "none");
					});

					showBaseMap = !showBaseMap;
				},
			},
			() => (showBaseMap ? "Turn off base map" : "Turn on base map"),
		),
	),
);

// Add Maplibre Styles
addGlobalStyles(maplibreStyles);

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
	}
`);
