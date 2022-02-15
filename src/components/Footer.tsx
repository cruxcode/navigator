import React from "react";

export interface FooterProps {}

const styles: { [key: string]: React.CSSProperties } = {
	container: {
		flexGrow: 1,
		minHeight: "200px",
	},
};

export const Footer: React.FC<FooterProps> = React.memo((props) => {
	return <div style={styles.container}></div>;
});
