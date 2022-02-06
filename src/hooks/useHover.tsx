import { useEffect, useState } from "react";
import { WidgetTreeItem } from "../components/WidgetTreeItem";

export const useHover = (
	widgets: WidgetTreeItem[]
): [
	(
		| (WidgetTreeItem & {
				onMouseEnter: () => void;
				onMouseLeave: () => void;
				onMouseDown: () => void;
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
		})[]
	>([]);
	useEffect(() => {
		setWidgetsWithListeners(
			widgets.map((widget) => {
				return {
					...widget,
					onMouseEnter: () => {
						setShowHoverFor(widget.ID);
					},
					onMouseLeave: () => {
						setShowHoverFor(undefined);
					},
					onMouseDown: () => {
						console.log("mouseDown called");
						setShowHoverFor(undefined);
						setShowSelectedFor(widget.ID);
						const upListener = () => {
							setShowSelectedFor(undefined);
							window.removeEventListener("mouseup", upListener);
						};
						window.addEventListener("mouseup", upListener);
					},
				};
			})
		);
	}, [setShowHoverFor, setWidgetsWithListeners, setShowSelectedFor]);
	return [widgetsWithListeners, showHoverFor, showSelectedFor];
};
