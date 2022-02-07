// shouldDisplay - for identifying whether to render a element
// all the children of a node with isExpanded false will have shouldDisplay false
// isLastChild - for identifying whether to allow left movement
// nodeLevel - for calculating left margin
// isPreviousSiblingAParent - for identifying whether to allow right movement
// isPreviousSublingAParent && isPreviousSibling isExpanded set to true

export type WidgetTreeItem = {
	name: string;
	ID: string;
	icon: React.FC<{}>;
	parentID: string;
	nodeLevel: number;
	hasChild: boolean;
	isExpanded: boolean;
	shouldDisplay: boolean;
	isLastChild: boolean;
	leftMoves: number;
};
