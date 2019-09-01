import "./Panel.css";
import React from "react";
import mapService from "../MapViewer/MapService";

export function Panel() {
	const { pointerPosition } = mapService;

	return (
		<div className="panel">
			Position : {pointerPosition.x} ; {pointerPosition.y}
		</div>
	);
}
