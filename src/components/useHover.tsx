import { useEffect, useState } from "react";

export const useHover = (
	widgets: {
		name: string;
		icon: React.FC<{}>;
		leftMargin: string;
		ID: string;
		hasChild: boolean;
	}[]
): [
	(
		| {
				name: string;
				icon: React.FC<{}>;
				leftMargin: string;
				ID: string;
				hasChild: boolean;
				onMouseEnter: () => void;
				onMouseLeave: () => void;
				onMouseDown: () => void;
		  }[]
		| undefined
	),
	string | undefined,
	string | undefined
] => {
	const [showHoverFor, setShowHoverFor] = useState<string | undefined>();
	const [showSelectedFor, setShowSelectedFor] = useState<
		string | undefined
	>();
	const [widgetsWithListeners, setWidgetsWithListeners] = useState<
		{
			name: string;
			icon: React.FC<{}>;
			leftMargin: string;
			ID: string;
			hasChild: boolean;
			onMouseEnter: () => void;
			onMouseLeave: () => void;
			onMouseDown: () => void;
		}[]
	>();
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
