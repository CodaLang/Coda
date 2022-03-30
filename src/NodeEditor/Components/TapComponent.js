import Rete from "rete";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import Sockets from "../sockets";

export default class TapComponent extends Rete.Component {
	constructor(ConsoleStream){
		super("Tap");
		this.subscriptions = {};
		this.observable = new Subject();
		this.consoleStream = ConsoleStream;
	}

	async builder(node){
		const input1 = new Rete.Input("data", "<A>", Sockets.AnyValue);
		const output1 = new Rete.Output("data", "<A>", Sockets.AnyValue);

		node.addInput(input1).addOutput(output1);
	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable
		};

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			data: (value) => {
				// value = inputs.data[0].string || inputs.data[0].num || value;
				console.log(value);
				this.consoleStream.next(value + "");
				return value;
			}
		});
	}
}