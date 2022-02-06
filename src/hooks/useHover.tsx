import { useEffect, useState, MouseEventHandler } from "react";
import { IWidgetTree } from "../class/IWidgetTree";
import { WidgetTreeItem } from "../components/WidgetTreeItem";

export const useHover = (
	widgetTree: IWidgetTree
): [
	(
		| (WidgetTreeItem & {
				onMouseEnter: () => void;
				onMouseLeave: () => void;
				onMouseDown: () => void;
				onMouseMove: MouseEventHandler;
		  })[]
	),
	string | undefined,
	string | undefined
] => {
	const [showHoverFor, setShowHoverFor] = useState<string | undefined>();
	const [showSelectedFor, setShowSelectedFor] = useState<
		string | undefined
	>();
	const [widgetsWithListeners, setWidgetsWithListeners] = useState<
		(WidgetTreeItem & {
			onMouseEnter: () => void;
			onMouseLeave: () => void;
			onMouseDown: () => void;
			onMouseMove: MouseEventHandler;
		})[]
	>([]);
	useEffect(() => {
		widgetTree.subscribeWidgetTree({
			next: (widgets) => {
				setWidgetsWithListeners(
					widgets.map((widget) => {
						const timeLimit = 200; // in milliseconds
						// timer is also used as a flag to start a new timer
						// timer if undefined
						let timer: any;
						let moveStartTime: Date | undefined;
						let moveStartX: number | undefined;
						let moveStartY: number | undefined;
						let currStartX: number | undefined;
						let currStartY: number | undefined;
						let ticks: number = 0;
						return {
							...widget,
							onMouseEnter: () => {
								moveStartTime = undefined;
								moveStartX = undefined;
								moveStartY = undefined;
								ticks = 0;
								setShowHoverFor(widget.ID);
							},
							onMouseLeave: () => {
								setShowHoverFor(undefined);
							},
							onMouseDown: () => {
								setShowHoverFor(undefined);
								setShowSelectedFor(widget.ID);
								const upListener = () => {
									setShowSelectedFor(undefined);
									window.removeEventListener(
										"mouseup",
										upListener
									);
								};
								window.addEventListener("mouseup", upListener);
							},
							onMouseMove: (event) => {
								const currTime = new Date();
								currStartX = event.pageX;
								currStartY = event.pageY;
								if (timer === undefined) {
									// reset
									moveStartTime = currTime;
									moveStartX = event.pageX;
									moveStartY = event.pageY;
									timer = setTimeout(() => {
										// calculate slope
										if (moveStartX! - currStartX! !== 0) {
											// console.log("calculating slope");
											// const slope =
											// 	Math.abs(
											// 		moveStartY! - currStartY!
											// 	) /
											// 	(moveStartX! - currStartX!);
											// console.log(slope);
											if (
												moveStartX! - currStartX! >
												30
												// 	&&
												// slope <= 0.5 &&
												// slope > 0
											) {
												ticks = ticks + 1;
												widgetTree.moveLeft(
													widget.ID,
													ticks
												);
											}
											if (
												moveStartX! - currStartX! <
													-30 &&
												ticks > 0
											) {
												ticks = ticks - 1;
												widgetTree.moveLeft(
													widget.ID,
													ticks
												);
											}
										}
										timer = undefined;
									}, timeLimit);
								}
							},
						};
					})
				);
			},
		});
	}, [setShowHoverFor, setWidgetsWithListeners, setShowSelectedFor]);
	return [widgetsWithListeners, showHoverFor, showSelectedFor];
};
