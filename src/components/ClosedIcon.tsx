import { ControlIconProps } from "../class/ControlIconProps";

export const ClosedIcon: React.FC<ControlIconProps> = (props) => {
	return (
		<div style={{ display: "flex" }} onClick={props.onClick}>
			<svg
				width="10"
				height="10"
				viewBox="0 0 10 10"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 3L4.75 6.75L8.5 3H1Z"
					fill="#9CA3AF"
					transform="rotate(90, 5, 5)"
				/>
			</svg>
		</div>
	);
};
