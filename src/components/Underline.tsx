export interface UnderlineProps {
	showLineColor: string;
	width: string;
}
export const style: { [key: string]: React.CSSProperties } = {
	line: {
		position: "absolute",
		bottom: "0",
		height: "1px",
		right: 0,
	},
};

export const Underline: React.FC<UnderlineProps> = (props) => {
	return (
		<div
			style={{
				...style.line,
				background: props.showLineColor,
				width: props.width,
			}}
		></div>
	);
};
