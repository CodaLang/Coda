import Rete from "rete";
import { fromEvent, map, Subject, tap } from "rxjs";
import Sockets from "../../sockets";
import { TimelineInputStream, TimelineOutputStream } from "../../timelineAPI";

export default class MouseClickSignal extends Rete.Component {
	constructor(){
		super("MouseClickSignal");

		this.mouseClickStream = new Subject();

		//For normal mousedown events
		fromEvent(document, "mousedown").pipe(
			map((event) => {
				return {
					x: event.clientX,
					y: event.clientY,
				}
			}),
			tap((coordinates) => {
				//Add to timeline history
				TimelineInputStream.next({
					action: "MouseClick",
					data: coordinates
				})
				return coordinates;
			})
		).subscribe((coordinates) => {
			this.mouseClickStream.next(coordinates);
		})

		//For rewinding
		this.timelineSubscription = TimelineOutputStream.subscribe((event) => {
			if(event.action === "MouseClick"){
				this.mouseClickStream.next(event.data);
			}
		})
	}

	async builder(node){
		node.addOutput(new Rete.Output("data", "{x, y}", Sockets.AnyValue));
	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.mouseClickStream,
		}
	}
}