import { useState, useRef, useEffect, useCallback, useMemo } from "react";

const styles = {
	html: {
		background: "black",
		color: "white",
		minHeight: "100vh",
	},
	main: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: "5rem",
	},
	grid: {
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
		gap: "1rem",
		padding: "2rem",
		maxWidth: "1200px",
		width: "100%",
	},
	gridItem: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "0.5rem",
		padding: "1rem",
		border: "1px solid #333",
		borderRadius: "4px",
	},
	button: {
		padding: "0.5rem 1rem",
		backgroundColor: "#0066cc",
		color: "white",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer",
		fontSize: "0.875rem",
	},
	performanceDisplay: {
		position: "fixed",
		top: "10px",
		right: "10px",
		background: "rgba(0,0,0,0.8)",
		padding: "1rem",
		borderRadius: "8px",
		border: "1px solid #333",
		fontSize: "0.875rem",
	},
	title: {
		fontSize: "3rem",
		margin: "2rem 0",
		transition: "transform 250ms ease",
	},
	header: {
		fontSize: "1.5rem",
		marginBottom: "1rem",
	},
	footer: {
		marginTop: "2rem",
		fontSize: "0.875rem",
		color: "#ccc",
	},
};

const GRID_SIZE = 20000; // Reduced from 20000 for better performance

const GridItem = ({ item, count, onIncrement }) => {
	return (
		<section style={styles.gridItem}>
			<p>{count}</p>
			<button onClick={() => onIncrement(item.value)}>
				Add {item.value}
			</button>
		</section>
	);
};

function App() {
	const [count, setCount] = useState(0);
	const [totalRenderTime, setTotalRenderTime] = useState(0);
	const renderStartTime = useRef(0);
	const updateRequested = useRef(false);

	// Memoize grid items to prevent recreation on every render
	const gridItems = useMemo(
		() =>
			Array(GRID_SIZE)
				.fill(null)
				.map((_, i) => ({
					id: i,
					value: i + 1,
				})),
		[],
	);

	// Memoize the increment handler to prevent unnecessary re-renders
	const handleIncrement = useCallback((incrementValue) => {
		console.log("Button clicked!", incrementValue);
		renderStartTime.current = performance.now();
		updateRequested.current = true;
		setCount((prevCount) => prevCount + incrementValue);
	}, []);

	// Calculate performance metrics
	useEffect(() => {
		if (updateRequested.current) {
			const endTime = performance.now();
			setTotalRenderTime(endTime - renderStartTime.current);
			updateRequested.current = false;
		}
	}, [count]);

	// Memoize title rotation style
	const titleStyle = useMemo(
		() => ({
			...styles.title,
			transform: `rotate(${count}deg)`,
		}),
		[count],
	);

	return (
		<div style={styles.html}>
			<main style={styles.main}>
				<header style={styles.header}>Welcome to the IMA App!</header>

				<h1 style={titleStyle}>IMA</h1>

				<div style={styles.performanceDisplay}>
					<p>Components: {gridItems.length.toLocaleString()}</p>
					<p>Count: {count.toLocaleString()}</p>
					<p>Render time: {totalRenderTime.toFixed(2)}ms</p>
				</div>

				<div style={styles.grid} role="grid" aria-label="Interactive grid">
					{gridItems.map((item) => (
						<GridItem key={item.id} item={item} count={count} onIncrement={handleIncrement} />
					))}
				</div>

				<footer style={styles.footer}>Copyright © 2023 IMA. All rights reserved.</footer>
			</main>
		</div>
	);
}

export default App;
