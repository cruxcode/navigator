import React, { useCallback } from "react";
import {
	amber300,
	gray300,
	gray700,
	gray800,
	gray800Hover,
	pink700,
	spacing20,
} from "../consts";
import { Header } from "./Header";
import { Element } from "./Element";
import { Controls } from "./Controls";
import { useHover } from "../hooks/useHover";
import { DropIcon } from "./DropIcon";
import { WidgetTreeItem } from "./WidgetTreeItem";
import { IWidgetTree } from "../class/IWidgetTree";
import { ClosedIcon } from "./ClosedIcon";
import { Footer } from "./Footer";

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
		overflow: "hidden",
		// TO BE REMOVED
		width: "15rem", // width: 100%
	},
	scrollable: {
		height: "100%",
		overflow: "auto",
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
	return `calc(${spacing20} * ${tabs})`;
}

export interface NavigatorProps {
	widgetTree: IWidgetTree;
}

export const Navigator: React.FC<NavigatorProps> = (props) => {
	const [widgetsWithListeners, showHoverFor, showSelectedFor] = useHover(
		props.widgetTree
	);
	const getLineColor = useCallback(
		(widgetID: string) => {
			// showSelectedFor and showHoverFor should not be in parent-child path
			return showHoverFor?.ID === widgetID &&
				showSelectedFor &&
				showHoverFor !== showSelectedFor
				? props.widgetTree.isAncestor(
						showHoverFor.ID,
						showSelectedFor.ID
				  )
					? pink700
					: amber300
				: "";
		},
		[showHoverFor, showSelectedFor]
	);
	const getBackground = useCallback(
		(widgetID: string) => {
			return showHoverFor?.ID === widgetID
				? gray800Hover
				: showSelectedFor?.ID === widgetID
				? gray800
				: "";
		},
		[showHoverFor, showSelectedFor]
	);
	const reduceOpacity = useCallback(
		(widgetID: string) => {
			return showSelectedFor?.ID === widgetID ? "0.5" : "1";
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
	const getIcon = useCallback((widget: WidgetTreeItem) => {
		if (widget.isExpanded) {
			return DropIcon;
		}
		return ClosedIcon;
	}, []);
	const getLeftMoves = (moves: number) => {
		return `calc(${spacing20}*${moves})`;
	};
	const showThreeSidedBorder = (widget: WidgetTreeItem): boolean => {
		if (showHoverFor) {
			if (showHoverFor.hasChild && showHoverFor.isExpanded) {
				return showHoverFor.ID === widget.ID;
			}
			let parentLevel = showHoverFor.leftMoves + 1;
			const parentWidget = props.widgetTree.getParentAtLevel(
				showHoverFor.ID,
				parentLevel
			);
			console.log("setting true", parentWidget);
			return parentWidget.ID === widget.ID;
		}
		return false;
	};
	return (
		<div style={styles.navigator}>
			<Header />
			<div style={styles.scrollable}>
				{widgetsWithListeners ? (
					<div style={styles.main}>
						<div style={styles.elements}>
							{widgetsWithListeners.map((widget) => {
								if (widget.shouldDisplay)
									return (
										<div key={widget.ID}>
											<Element
												name={widget.name}
												icon={widget.icon}
												leftMargin={calcSpacing(
													widget.nodeLevel
												)}
												onMouseEnter={
													widget.onMouseEnter
												}
												onMouseLeave={
													widget.onMouseLeave
												}
												onMouseDown={widget.onMouseDown}
												onMouseMove={widget.onMouseMove}
												showLineColor={getLineColor(
													widget.ID
												)}
												leftLinePadding={getLinePadding(
													widget
												)}
												background={getBackground(
													widget.ID
												)}
												opacity={reduceOpacity(
													widget.ID
												)}
												leftMoves={getLeftMoves(
													widget.leftMoves
												)}
												showThreeSidedBorder={showThreeSidedBorder(
													widget
												)}
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
																icon: getIcon(
																	widget
																),
																onClick: () => {
																	widget.isExpanded
																		? props.widgetTree.unexpandNode(
																				widget.ID
																		  )
																		: props.widgetTree.expandNode(
																				widget.ID
																		  );
																},
															},
													  ]
													: []
											}
											key={widget.ID}
											onMouseEnter={widget.onMouseEnter}
											onMouseLeave={widget.onMouseLeave}
											background={getBackground(
												widget.ID
											)}
											showLineColor={getLineColor(
												widget.ID
											)}
											opacity={reduceOpacity(widget.ID)}
											showThreeSidedBorder={showThreeSidedBorder(
												widget
											)}
										/>
									);
								else return null;
							})}
						</div>
					</div>
				) : null}
				<Footer />
			</div>
		</div>
	);
};
