import { RectIcon } from "../components/RectIcon";
import { WidgetTreeItem } from "../components/WidgetTreeItem";
import { BehaviorSubject, Observer } from "rxjs";
import { IWidgetTree } from "./IWidgetTree";
type ParentChildMap = { [parent: string]: { child: string; index: number }[] };
// interfaces with DesignRuntime
export class WidgetTree implements IWidgetTree {
	private subject: BehaviorSubject<WidgetTreeItem[]>;
	private parentChildMap: ParentChildMap;
	constructor() {
		const [widgets, parentChildMap] = this.fromDesignRuntime();
		this.subject = new BehaviorSubject<WidgetTreeItem[]>(widgets);
		this.parentChildMap = parentChildMap;
	}
	get widgets() {
		return this.subject.value;
	}
	fromDesignRuntime(): [WidgetTreeItem[], ParentChildMap] {
		// TODO: calculate WidgetTreeItem[] from DesignRuntime.getState()
		// TODO: calculate parent->child relationship from DesignRuntime.getState()
		// TODO: subscribe to DesignRuntime.subscribeWebBus for future changes
		const widgets: WidgetTreeItem[] = [
			{
				name: "Body",
				ID: "1",
				icon: RectIcon,
				nodeLevel: 1,
				hasChild: true,
				isExpanded: true,
				shouldDisplay: true,
				isLastChild: false,
				isPreviousSiblingAnExpandedParent: false,
			},
			{
				name: "Div Block 1",
				ID: "2",
				icon: RectIcon,
				nodeLevel: 2,
				hasChild: true,
				isExpanded: true,
				shouldDisplay: true,
				isLastChild: false,
				isPreviousSiblingAnExpandedParent: false,
			},
			{
				name: "Text Block 1",
				ID: "3",
				icon: RectIcon,
				nodeLevel: 3,
				hasChild: false,
				isExpanded: false,
				shouldDisplay: true,
				isLastChild: false,
				isPreviousSiblingAnExpandedParent: true,
			},
			{
				name: "Div Block 2",
				ID: "4",
				icon: RectIcon,
				nodeLevel: 3,
				hasChild: true,
				isExpanded: true,
				shouldDisplay: true,
				isLastChild: false,
				isPreviousSiblingAnExpandedParent: true,
			},
			{
				name: "Text Block 3",
				ID: "5",
				icon: RectIcon,
				nodeLevel: 4,
				hasChild: false,
				isExpanded: false,
				shouldDisplay: true,
				isLastChild: false,
				isPreviousSiblingAnExpandedParent: true,
			},
		];
		const parentChildMap = {
			"1": [{ child: "2", index: 1 }],
			"2": [
				{ child: "3", index: 2 },
				{ child: "4", index: 3 },
			],
			"4": [{ child: "5", index: 4 }],
		};
		return [widgets, parentChildMap];
	}
	// subscribe for widgets
	subscribeWidgetTree(observer: Partial<Observer<WidgetTreeItem[]>>) {
		return this.subject.subscribe(observer);
	}
	// rewiring node from one point to another
	rewire(widgetID: string, parentID: string) {
		// TODO: call DesignRuntime.rewire
		// remove below code once connected with DesignRuntime
		console.error("rewire not implemented");
	}
	private _markDisplay(widget: WidgetTreeItem, value: boolean) {
		if (this.parentChildMap[widget.ID]) {
			this.parentChildMap[widget.ID].map((child) => {
				console.log(child.index);
				this.widgets[child.index].shouldDisplay = value;
				if (widget.hasChild && widget.isExpanded)
					this._markDisplay(this.widgets[child.index], value);
			});
		}
	}
	expandNode(widgetID: string) {
		this.widgets.forEach((widget) => {
			if (widget.ID === widgetID) {
				this._markDisplay(widget, true);
				widget.isExpanded = true;
			}
		});
		// re-publish with updates
		this.subject.next(this.widgets);
	}
	unexpandNode(widgetID: string) {
		this.widgets.forEach((widget) => {
			if (widget.ID === widgetID) {
				widget.isExpanded = false;
				this._markDisplay(widget, false);
			}
		});
		// re-publish with updates
		this.subject.next(this.widgets);
	}
}
