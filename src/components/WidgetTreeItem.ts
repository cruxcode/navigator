export type WidgetTreeItem = {
	name: string;
	ID: string;
	icon: React.FC<{}>;
	leftMargin: string;
	hasChild: boolean;
	isExpanded: boolean;
};
