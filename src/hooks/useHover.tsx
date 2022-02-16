import { useEffect, useState, MouseEventHandler, useRef } from "react";
import { IWidgetTree } from "../types/IWidgetTree";
import { WidgetTreeItem } from "../components/WidgetTreeItem";

export const useHover = (
	widgetTree: IWidgetTree
): [
	(
		| (WidgetTreeItem & {
				onMouseEnter: MouseEventHandler;
				onMouseLeave: MouseEventHandler;
				onMouseDown: MouseEventHandler;
				onMouseMove: MouseEventHandler;
		  })[]
	),
	WidgetTreeItem | undefined,
	WidgetTreeItem | undefined
] => {
	const [showHoverFor, setShowHoverFor] = useState<
		WidgetTreeItem | undefined
	>();
	const [showSelectedFor, setShowSelectedFor] = useState<
		WidgetTreeItem | undefined
	>();
	const isMouseDown = useRef<boolean>(false);
	const [widgetsWithListeners, setWidgetsWithListeners] = useState<
		(WidgetTreeItem & {
			onMouseEnter: MouseEventHandler;
			onMouseLeave: MouseEventHandler;
			onMouseDown: MouseEventHandler;
			onMouseMove: MouseEventHandler;
		})[]
	>([]);
	useEffect(() => {
		widgetTree.subscribeWidgetTree({
			next: (widgets) => {
				setWidgetsWithListeners(
					widgets.map((widget) => {
						let moveStartX: number | undefined;
						let moveStartY: number | undefined;
						let currStartX: number | undefined;
						let currStartY: number | undefined;
						let ticks: number = widget.leftMoves;
						// code for opening a parent widget
						// amount of time the cursor must hover over a parent
						const minHoverTime = 750;
						let hoverTimer: any = undefined;
						return {
							...widget,
							onMouseEnter: (event) => {
								moveStartX = event.pageX;
								moveStartY = event.pageY;
								ticks = 0;
								if (widget.leftMoves !== 0)
									widgetTree.setLeftMoves(widget.ID, 0);
								setShowHoverFor(widget);
								// code for opening a parent widget
								if (
									widget.hasChild &&
									!widget.isExpanded &&
									widget.leftMoves === 0 &&
									isMouseDown.current
								) {
									hoverTimer = setTimeout(() => {
										if (widget.leftMoves === 0) {
											widgetTree.expandNode(widget.ID);
										}
									}, minHoverTime);
								}
							},
							onMouseLeave: (_event) => {
								setShowHoverFor(undefined);
								// code for opening / closing a parent widget
								clearTimeout(hoverTimer);
							},
							onMouseDown: (_event) => {
								setShowHoverFor(undefined);
								setShowSelectedFor(widget);
								isMouseDown.current = true;
								const upListener = () => {
									setShowSelectedFor(undefined);
									isMouseDown.current = false;
									window.removeEventListener(
										"mouseup",
										upListener
									);
								};
								window.addEventListener("mouseup", upListener);
							},
							onMouseMove: (event) => {
								currStartX = event.pageX;
								currStartY = event.pageY;
								if (
									moveStartX === undefined ||
									moveStartY === undefined
								) {
									console.log("resetting moveStartX");
									moveStartX = currStartX;
									moveStartY = currStartY;
								}
								if (moveStartX! - currStartX! !== 0) {
									if (moveStartX! - currStartX! > 30) {
										ticks = ticks + 1;
										widgetTree.moveLeft(widget.ID, ticks);
									}
									if (
										moveStartX! - currStartX! < -30 &&
										ticks > 0
									) {
										ticks = ticks - 1;
										widgetTree.moveLeft(widget.ID, ticks);
									}
									// edge case
									// someone goes right first and then start going left
									if (
										moveStartX! - currStartX! < 0 &&
										ticks === 0
									) {
										moveStartX = currStartX;
										moveStartY = currStartY;
									}
								}
							},
						};
					})
				);
			},
		});
	}, [
		setShowHoverFor,
		setWidgetsWithListeners,
		setShowSelectedFor,
		isMouseDown,
	]);
	return [widgetsWithListeners, showHoverFor, showSelectedFor];
};
