import { Observer, Subscription } from "rxjs";
import { WidgetTreeItem } from "../components/WidgetTreeItem";

export interface IWidgetTree {
	get widgets(): WidgetTreeItem[];
	subscribeWidgetTree(
		observer: Partial<Observer<WidgetTreeItem[]>>
	): Subscription;
	rewire(hoveredID: string, selectedID: string): void;
	expandNode(widgetID: string): void;
	unexpandNode(widgetID: string): void;
	/**
	 *
	 * @param widgetID ID of the widget on which mouse is currently being hovered
	 * @param ticks number of steps to take in right/left direction
	 * @returns widget ID of the new parent
	 */
	moveRight(widgetID: string, ticks: number): string;
	moveLeft(widgetID: string, ticks: number): string;
	setLeftMoves(widgetID: string, moves: number): void;
}
