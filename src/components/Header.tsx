import React from "react";
import { spacing11, gray800, spacing20 } from "../consts";

export const style: { [key: string]: React.CSSProperties } = {
	header: {
		paddingTop: spacing11,
		paddingBottom: spacing11,
		paddingLeft: spacing20,
		borderBottom: `1.5px solid ${gray800}`,
		width: "auto",
		textAlign: "left",
	},
};

export const Header: React.FC = React.memo(() => {
	return <div style={style.header}>Navigator</div>;
});
