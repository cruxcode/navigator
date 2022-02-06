import { RectIcon } from "../components/RectIcon";
import { WidgetTreeItem } from "../components/WidgetTreeItem";
import { BehaviorSubject, Observer } from "rxjs";
type ParentChildMap = { [parent: string]: { child: string; index: number }[] };
// interfaces with DesignRuntime
export class WidgetTree {
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
			"1": [{ child: "2", index: 2 }],
			"2": [
				{ child: "3", index: 3 },
				{ child: "4", index: 4 },
			],
			"4": [{ child: "5", index: 5 }],
		};
		return [widgets, parentChildMap];
	}
	// subscribe for widgets
	subscribeWidgetTree(observer: Observer<WidgetTreeItem[]>) {
		return this.subject.subscribe(observer);
	}
	// rewiring node from one point to another
	rewire(widgetID: string, parentID: string) {
		// TODO: call DesignRuntime.rewire
		// remove below code once connected with DesignRuntime
		console.error("rewire not implemented");
	}
	private _markDisplay(widgetID: string, value: boolean) {
		this.parentChildMap[widgetID].map((child) => {
			this.widgets[child.index].shouldDisplay = value;
			this._markDisplay(child.child, value);
		});
	}
	expandNode(widgetID: string) {
		this.widgets.forEach((widget) => {
			if (widget.ID === widgetID) {
				widget.isExpanded = true;
				this._markDisplay(widgetID, true);
			}
		});
		// re-publish with updates
		this.subject.next(this.widgets);
	}
	unexpandNode(widgetID: string) {
		this.widgets.forEach((widget) => {
			if (widget.ID === widgetID) {
				widget.isExpanded = false;
				this._markDisplay(widgetID, false);
			}
		});
		// re-publish with updates
		this.subject.next(this.widgets);
	}
}
