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
	moveRight(widgetID: string, ticks: number): string {
		throw new Error("Method not implemented.");
	}
	private _moveLeft(widgetID: string, ticks: number): string {
		if (ticks === 0) {
			return widgetID;
		}
		const widget = this.widgets.find((widget) => {
			if (widget.ID === widgetID) {
				return true;
			}
			return false;
		});
		if (widget?.isLastChild) {
			return this._moveLeft(widget.parentID, ticks - 1);
		}
		return widget!.ID;
	}
	moveLeft(widgetID: string, ticks: number): string {
		console.log("move left called");
		const currWidget = this.widgets.find((widget) => {
			if (widget.ID === widgetID) {
				return true;
			}
			return false;
		});
		// edge case
		if (ticks === 0) {
			currWidget!.leftMoves = 0;
			this.subject.next(this.widgets);
			return currWidget!.ID;
		}
		// edge case
		if (currWidget?.hasChild && currWidget.isExpanded) {
			currWidget!.leftMoves = 0;
			this.subject.next(this.widgets);
			return currWidget!.ID;
		}
		const newSibling = this._moveLeft(widgetID, ticks);
		console.log("move left with ticks", ticks, newSibling);
		const newSiblingWidget = this.widgets.find((widget) => {
			if (widget.ID === newSibling) {
				return true;
			}
			return false;
		});
		// edge case - new sibling cannot be root or body
		if (newSiblingWidget!.nodeLevel === 1) {
			this.subject.next(this.widgets);
			return widgetID;
		}
		if (currWidget!.nodeLevel - newSiblingWidget!.nodeLevel > 0) {
			currWidget!.leftMoves =
				currWidget!.nodeLevel - newSiblingWidget!.nodeLevel;
			console.log(currWidget!.leftMoves);
			this.subject.next(this.widgets);
		}
		return newSiblingWidget!.ID;
	}
	setLeftMoves(widgetID: string, moves: number) {
		const currWidget = this.widgets.find((widget) => {
			if (widget.ID === widgetID) {
				return true;
			}
			return false;
		});
		currWidget!.leftMoves = 0;
		// TODO: causes re-rendering on mouse enter
		// prevent re-rendering
		this.subject.next(this.widgets);
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
				parentID: "",
				icon: RectIcon,
				nodeLevel: 1,
				hasChild: true,
				isExpanded: true,
				shouldDisplay: true,
				isLastChild: false,
				leftMoves: 0,
			},
			{
				name: "Div Block 1",
				ID: "2",
				icon: RectIcon,
				parentID: "1",
				nodeLevel: 2,
				hasChild: true,
				isExpanded: true,
				shouldDisplay: true,
				isLastChild: true,
				leftMoves: 0,
			},
			{
				name: "Text Block 1",
				ID: "3",
				icon: RectIcon,
				parentID: "2",
				nodeLevel: 3,
				hasChild: false,
				isExpanded: false,
				shouldDisplay: true,
				isLastChild: false,
				leftMoves: 0,
			},
			{
				name: "Div Block 2",
				ID: "4",
				icon: RectIcon,
				parentID: "2",
				nodeLevel: 3,
				hasChild: true,
				isExpanded: true,
				shouldDisplay: true,
				isLastChild: true,
				leftMoves: 0,
			},
			{
				name: "Text Block 3",
				ID: "5",
				icon: RectIcon,
				parentID: "4",
				nodeLevel: 4,
				hasChild: false,
				isExpanded: false,
				shouldDisplay: true,
				isLastChild: true,
				leftMoves: 0,
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
	rewire(hoveredID: string, selectedID: string) {
		// TODO: call DesignRuntime.rewire
		// remove below code once connected with DesignRuntime
		// use the hovered widget details and selected widget details to figure out re-wiring details
		console.error("rewire not implemented");
	}
	private _markDisplay(widgetID: string, value: boolean) {
		if (this.parentChildMap[widgetID]) {
			this.parentChildMap[widgetID].map((child) => {
				this.widgets[child.index].shouldDisplay = value;
				if (
					this.widgets[child.index].hasChild &&
					this.widgets[child.index].isExpanded
				)
					this._markDisplay(child.child, value);
			});
		}
	}
	expandNode(widgetID: string) {
		this.widgets.forEach((widget) => {
			if (widget.ID === widgetID) {
				// order of setting isExpanded and marking shouldDisplay is important
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
				// order of setting isExpanded and marking shouldDisplay is important
				this._markDisplay(widgetID, false);
				widget.isExpanded = false;
			}
		});
		// re-publish with updates
		this.subject.next(this.widgets);
	}
	isAncestor(childID: string, parentID: string): boolean {
		const childWidget = this.widgets.find((widget) => {
			return widget.ID === childID;
		});
		if (childWidget?.parentID === parentID) {
			return true;
		}
		if (childWidget?.parentID === "") {
			return false;
		} else {
			return this.isAncestor(childWidget!.parentID, parentID);
		}
	}
}
