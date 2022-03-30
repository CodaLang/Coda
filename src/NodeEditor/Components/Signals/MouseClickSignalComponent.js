import Rete from "rete";
import { filter, fromEvent, map, Subject, tap } from "rxjs";
import Sockets from "../../sockets";
import { TimelineInputStream, TimelineOutputStream } from "../../timelineAPI";

export default class MouseClickSignal extends Rete.Component {
	constructor(){
		super("MouseClickSignal");
		this.numberOfConnections = 0;

		this.mouseClickStream = new Subject();
		fromEvent(document, "mousedown").pipe(
			map((event) => {
				event.stopPropagation();
				return {
					x: event.clientX,
					y: event.clientY
				}
			}),
			tap((coordinates) => {
				// console.log(this.numberOfConnections);
				if (this.numberOfConnections > 0){
					TimelineInputStream.next({
						action: "MouseClick",
						data: coordinates
					});
				}
				return coordinates;
			})
		).subscribe(coordinates => {
			this.mouseClickStream.next(coordinates);
		})

		// For rewinding
		this.timelineSubscription = TimelineOutputStream.subscribe(event => {
			if (event.action === "MouseClick"){
				this.mouseClickStream.next(event.data);
			}
		})
	}

	async builder(node){
		node.addOutput(new Rete.Output("data", "[x, y]", Sockets.AnyValue));
	}

	worker(node, inputs, outputs){
		this.numberOfConnections = node.outputs.data.connections.length;
		// console.log(node.outputs.data.connections.length);
		outputs.data = {
			name: node.id,
			observable: this.mouseClickStream,
		}
	}
}