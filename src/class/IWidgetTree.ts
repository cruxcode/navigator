import { Observer, Subscription } from "rxjs";
import { WidgetTreeItem } from "../components/WidgetTreeItem";

export interface IWidgetTree {
	get widgets(): WidgetTreeItem[];
	subscribeWidgetTree(observer: Observer<WidgetTreeItem[]>): Subscription;
	rewire(widgetID: string, parentID: string): void;
	expandNode(widgetID: string): void;
	unexpandNode(widgetID: string): void;
}
