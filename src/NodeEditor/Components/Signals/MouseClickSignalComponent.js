import Rete from "rete";
import { filter, fromEvent, map, Subject, tap } from "rxjs";
import Sockets from "../../sockets";
import { TimelineInputStream, TimelineOutputStream } from "../../timelineAPI";

export default class MouseClickSignal extends Rete.Component {
	constructor(){
		super("MouseClickSignal");
		this.mouseClickStreamTable = {};
		this.subscriptionTable = {}
		this.valueTable = {}
	}

	async builder(node){
		this.mouseClickStreamTable[node.id] = new Subject();
		this.valueTable[node.id] = {
			numberOfConnections: 0,
		}

		fromEvent(document, "mousedown").pipe(
			map((event) => {
				event.stopPropagation();
				return [
					event.clientX,
					event.clientY
				]
			}),
			tap((coordinates) => {
				// console.log(this.numberOfConnections);
				if (this.valueTable[node.id].numberOfConnections > 0){
					TimelineInputStream.next({
						action: "MouseClick",
						data: coordinates
					});
				}
				return coordinates;
			})
		).subscribe(coordinates => {
			this.mouseClickStreamTable[node.id].next(coordinates);
		})

		// For rewinding
		this.subscriptionTable[node.id] = {
			timelineSubscription : TimelineOutputStream.subscribe(event => {
				if (event.action === "MouseClick"){
					this.mouseClickStreamTable[node.id].next(event.data);
				}
			})
		}

		node.addOutput(new Rete.Output("data", "[x, y]", Sockets.AnyValue));
	}

	worker(node, inputs, outputs){
		this.valueTable[node.id].numberOfConnections = node.outputs.data.connections.length;
		console.log(this.mouseClickStreamTable[node.id])
		outputs.data = {
			name: node.id,
			observable: this.mouseClickStreamTable[node.id],
		}
	}
}