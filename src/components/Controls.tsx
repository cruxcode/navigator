import React from "react";
import { ControlIconProps } from "../class/ControlIconProps";
import { spacing20, spacing25 } from "../consts";
import { Underline } from "./Underline";

export interface ControlProps {
	controls: {
		name: string;
		icon: React.FC<ControlIconProps>;
		onClick: () => void;
	}[];
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	background: string;
	showLineColor: string;
	opacity: string;
}

const styles: { [key: string]: React.CSSProperties } = {
	container: {
		display: "flex",
		height: spacing25,
		paddingRight: spacing20,
		alignItems: "center",
		width: "100%",
		boxSizing: "border-box",
		justifyContent: "flex-end",
		// for displaying underline
		position: "relative",
	},
};

export const Controls: React.FC<ControlProps> = React.memo((props) => {
	return (
		<div
			style={{
				...styles.container,
				background: props.background,
				opacity: props.opacity,
			}}
		>
			{props.controls.map((control) => {
				return <control.icon onClick={control.onClick} />;
			})}
			<Underline
				showLineColor={props.showLineColor}
				width={`calc(100% + ${spacing20})`}
			/>
		</div>
	);
});
