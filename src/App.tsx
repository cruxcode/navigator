import React, { useMemo, useRef } from "react";
import "./App.css";
import { WidgetTree } from "./types/WidgetTree";
import { Navigator } from "./components/Navigator";

function App() {
	const widgetTree = useRef(new WidgetTree());
	return (
		<div className="App" style={{ height: "100vh" }}>
			<Navigator widgetTree={widgetTree.current} />
		</div>
	);
}

export default App;
