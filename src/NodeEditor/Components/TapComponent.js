import Rete from "rete";
import { fromEvent, map, Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import Sockets from "../sockets";

export default class TapComponent extends Rete.Component {
	constructor(){
		super("Tap");
		this.subscriptions = {};
		this.observable = new Subject();
	}

	async builder(node){
		const input1 = new Rete.Input("data", "<A>", Sockets.AnyValue);
		const output1 = new Rete.Input("data", "<A>", Sockets.AnyValue);

		node.addInput(input1).addOutput(output1);
	}

	worker(node, inputs, outputs){
		outputs.num = {
			name: node.id,
			observable: this.observable
		};

		handleSubscription(inputs, "data", this.subscriptions, (value) => {
			console.log(value);
			return value;
		})

	}
}