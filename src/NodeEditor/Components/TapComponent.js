import Rete from "rete";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import Sockets from "../sockets";

export default class TapComponent extends Rete.Component {
	constructor(ConsoleStream){
		super("Tap");

		this.observableTable = {}
		this.subscriptionTable = {}
	}

	async builder(node){
		this.subscriptionTable[node.id] = {};
		this.observableTable[node.id] = new Subject();

		const input1 = new Rete.Input("data", "<A>", Sockets.AnyValue);
		const output1 = new Rete.Output("data", "<A>", Sockets.AnyValue);

		node.addInput(input1).addOutput(output1);
	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observableTable[node.id]
		};

		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			data: (value) => {
				console.log(value);
				this.observableTable[node.id].next(value);
				// this.consoleStream.next(value + "");
				return value;
			}
		});
	}
}