import React from "react";
import { sky400, spacing10 } from "../consts";

export interface BorderProps {
	left: boolean;
	right: boolean;
	top: boolean;
	bottom: boolean;
	leftMargin: string;
	rightMargin: string;
}

const styles: { [key: string]: React.CSSProperties } = {
	left: {
		height: "100%",
		background: sky400,
		position: "absolute",
		width: "1px",
		top: 0,
	},
	right: {
		height: "100%",
		background: sky400,
		position: "absolute",
		width: "1px",
		top: 0,
	},
	top: {
		position: "absolute",
		background: sky400,
		height: "1px",
		top: 0,
	},
	bottom: {
		position: "absolute",
		background: sky400,
		height: "1px",
		bottom: 0,
	},
};

export const Border: React.FC<BorderProps> = (props) => {
	const padding = spacing10;
	const leftStart = `calc(${props.leftMargin} - ${padding})`;
	const rightStart = `calc(${props.rightMargin} - ${padding})`;
	const width = `calc(100% - ${props.leftMargin} - ${props.rightMargin} + ${padding})`;
	return (
		<div>
			{props.left ? (
				<div style={{ ...styles.left, left: leftStart }}></div>
			) : null}
			{props.top ? (
				<div
					style={{
						...styles.top,
						width: width,
						left: props.left ? leftStart : "",
						right: props.right ? rightStart : "",
					}}
				></div>
			) : null}
			{props.right ? (
				<div style={{ ...styles.right, right: rightStart }}></div>
			) : null}
			{props.bottom ? (
				<div
					style={{
						...styles.bottom,
						width: width,
						left: props.left ? leftStart : "",
						right: props.right ? rightStart : "",
					}}
				></div>
			) : null}
		</div>
	);
};
