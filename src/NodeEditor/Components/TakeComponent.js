import Rete from "rete";
import { fromEvent, map, Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import Sockets from "../sockets";

export default class TakeComponent extends Rete.Component {
	constructor(){
		super("Take");
		this.subscriptions = {};
		this.observable = new Subject();
	}

	async builder(node){

		node
		.addInput(new Rete.Input("num", "Num", Sockets.NumValue))
		.addInput(new Rete.Input("data", "<A>", Sockets.AnyValue))
		.addOutput(new Rete.Output("data", "<A>", Sockets.AnyValue));

	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable
		};

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			data: (value) => {
				console.log(value);
				return value;
			}
		});
	}
}