
import Rete from "rete";
import { filter, fromEvent, map, Subject, tap } from "rxjs";
import Sockets from "../../sockets";
import { TimelineInputStream, TimelineOutputStream } from "../../timelineAPI";

export default class KeyPressSignal extends Rete.Component {
	constructor(){
		super("KeyPressSignal");
		this.keyPressStreamTable = {};
		this.subscriptionTable = {}
		this.valueTable = {}
	}

	async builder(node){
		this.keyPressStreamTable[node.id] = new Subject();
		this.valueTable[node.id] = {
			numberOfConnections: 0,
		}

		fromEvent(document, "keydown").pipe(
			map((event) => {
				// event.stopPropagation();
				return event.key;
			}),
			tap((key) => {
				// console.log(this.numberOfConnections);
				if (this.valueTable[node.id].numberOfConnections > 0){
					TimelineInputStream.next({
						action: "KeyPress",
						data: key
					});
				}
				return key;
			})
		).subscribe(coordinates => {
			this.keyPressStreamTable[node.id].next(coordinates);
		})

		// For rewinding
		this.subscriptionTable[node.id] = {
			timelineSubscription : TimelineOutputStream.subscribe(event => {
				if (event.action === "KeyPress"){
					this.keyPressStreamTable[node.id].next(event.data);
				}
			})
		}

		node.addOutput(new Rete.Output("data", "Key", Sockets.AnyValue));
	}

	worker(node, inputs, outputs){
		this.valueTable[node.id].numberOfConnections = node.outputs.data.connections.length;
		// console.log(this.mouseClickStreamTable[node.id])
		outputs.data = {
			name: node.id,
			observable: this.keyPressStreamTable[node.id],
		}
	}
}