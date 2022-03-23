import Rete from "rete";
import { fromEvent, map } from "rxjs";
import Sockets from "../../sockets";

export default class MouseClickSignal extends Rete.Component {
	constructor(){
		super("MouseClickSignal");
		this.mouseClickStream = fromEvent(document, "mousedown").pipe(
			map((event) => {
				return {
					x: event.clientX,
					y: event.clientY
				}
			})
		)
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