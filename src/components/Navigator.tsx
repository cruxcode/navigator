import React, { useCallback } from "react";
import {
	amber300,
	gray300,
	gray700,
	gray800,
	gray800Hover,
	spacing20,
} from "../consts";
import { Header } from "./Header";
import { Element } from "./Element";
import { Controls } from "./Controls";
import { useHover } from "../hooks/useHover";
import { DropIcon } from "./DropIcon";
import { WidgetTreeItem } from "./WidgetTreeItem";
import { IWidgetTree } from "../class/IWidgetTree";

const maxControlsWidth = "40px";

const styles: { [key: string]: React.CSSProperties } = {
	navigator: {
		display: "flex",
		backgroundColor: gray700,
		color: gray300,
		flexDirection: "column",
		fontFamily: "sans-serif",
		userSelect: "none",
		height: "100%",
		background: gray700,
		// TO BE REMOVED
		width: "15rem", // width: 100%
	},
	main: {
		display: "flex",
		width: "100%",
	},
	elements: {
		display: "flex",
		flexDirection: "column",
		overflow: "auto",
		flexGrow: 1,
		flexShrink: 1,
	},
	controls: {
		display: "flex",
		flexDirection: "column",
		width: maxControlsWidth,
		overflow: "hidden",
		alignItems: "flex-end",
	},
};

function calcSpacing(tabs: number) {
	return parseFloat(spacing20) * tabs + "rem";
}

export interface NavigatorProps {
	widgetTree: IWidgetTree;
}

export const Navigator: React.FC<NavigatorProps> = (props) => {
	const [widgetsWithListeners, showHoverFor, showSelectedFor] = useHover(
		props.widgetTree.widgets
	);
	const getLineColor = useCallback(
		(widgetID: string) => {
			return showHoverFor === widgetID && showSelectedFor ? amber300 : "";
		},
		[showHoverFor, showSelectedFor]
	);
	const getBackground = useCallback(
		(widgetID: string) => {
			return showHoverFor === widgetID && showSelectedFor === undefined
				? gray800Hover
				: showSelectedFor === widgetID
				? gray800
				: "";
		},
		[showHoverFor, showSelectedFor]
	);
	const reduceOpacity = useCallback(
		(widgetID: string) => {
			return showSelectedFor === widgetID ? "0.5" : "1";
		},
		[showHoverFor, showSelectedFor]
	);
	const getLinePadding = useCallback(
		(widget: WidgetTreeItem) => {
			if (widget.hasChild && widget.isExpanded) {
				return spacing20;
			}
			return "0px";
		},
		[widgetsWithListeners]
	);
	return (
		<div style={styles.navigator}>
			<Header />
			{widgetsWithListeners ? (
				<div style={styles.main}>
					<div style={styles.elements}>
						{widgetsWithListeners.map((widget) => {
							if (widget.shouldDisplay)
								return (
									<div>
										<Element
											name={widget.name}
											icon={widget.icon}
											leftMargin={calcSpacing(
												widget.nodeLevel
											)}
											onMouseEnter={widget.onMouseEnter}
											onMouseLeave={widget.onMouseLeave}
											onMouseDown={widget.onMouseDown}
											key={widget.ID}
											showLineColor={getLineColor(
												widget.ID
											)}
											leftLinePadding={getLinePadding(
												widget
											)}
											background={getBackground(
												widget.ID
											)}
											opacity={reduceOpacity(widget.ID)}
										></Element>
									</div>
								);
							else return null;
						})}
					</div>
					<div style={styles.controls}>
						{widgetsWithListeners.map((widget) => {
							if (widget.shouldDisplay)
								return (
									<Controls
										controls={
											widget.hasChild
												? [
														{
															name: "drop",
															icon: DropIcon,
															onClick: () => {},
														},
												  ]
												: []
										}
										key={widget.ID}
										onMouseEnter={widget.onMouseEnter}
										onMouseLeave={widget.onMouseLeave}
										background={getBackground(widget.ID)}
										showLineColor={getLineColor(widget.ID)}
										opacity={reduceOpacity(widget.ID)}
									/>
								);
							else return null;
						})}
					</div>
				</div>
			) : null}
		</div>
	);
};
