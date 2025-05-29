import React, { useState, useRef, useEffect } from "react";

const styles = {
	html: {
		background: "black",
		color: "white",
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
		gridTemplateColumns: "repeat(10, 1fr)",
		gap: "1rem",
		padding: "2rem",
	},
	performance_display: {
		position: "fixed",
		top: "10px",
		right: "10px",
		background: "rgba(0,0,0,0.7)",
		padding: "10px",
		borderRadius: "5px",
	},
};

function App() {
	const [count, set_count] = useState(0);
	const [total_render_time, set_total_render_time] = useState(0);
	const render_start_time = useRef(0);
	const update_requested = useRef(false);

	// Create an array of items
	const grid_items = Array(20000)
		.fill(null)
		.map((_, i) => ({
			id: i,
			value: i + 1,
		}));

	const handle_increment = (increment_value) => {
		console.log("Button clicked!", increment_value);
		render_start_time.current = performance.now();
		update_requested.current = true;
		set_count(count + increment_value);
	};

	useEffect(() => {
		if (update_requested.current) {
			const end_time = performance.now();
			set_total_render_time(end_time - render_start_time.current);
			update_requested.current = false;
		}
	}, [count]);

	return (
		<div style={styles.html}>
			<main style={styles.main}>
				<header>Welcome to the IMA App!</header>
				<h1
					style={{
						transform: `rotate(${count}deg)`,
						transition: `ease 250ms all`,
					}}
				>
					IMA
				</h1>

				<div style={styles.performance_display}>
					<p>Components: {grid_items.length}</p>
					<p>Total render time: {total_render_time.toFixed(2)}ms</p>
				</div>

				<div id="grid" style={styles.grid}>
					{grid_items.map((item) => (
						<section key={item.id}>
							<p>{count}</p>
							<button variant="default" onClick={() => handle_increment(item.value)}>
								Add {item.value}
							</button>
						</section>
					))}
				</div>

				<footer>Copyright © 2023 IMA. All rights reserved.</footer>
			</main>
		</div>
	);
}

export default App;
