
import Rete from "rete";
import Sockets from "../sockets";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";

export default class FilterComponent extends Rete.Component {
	constructor(){
		super("Filter");
		this.observableTable = {}
		this.subscriptionTable = {}
	}

	async builder(node){
		this.subscriptionTable[node.id] = {};
		this.observableTable[node.id] = new Subject();

		node
		.addInput(
			new Rete.Input("bool", "Boolean", Sockets.BooleanValue),
		)
		.addOutput(
			new Rete.Output("data", "Boolean", Sockets.AnyValue)
		)
	}

	async worker(node, inputs, outputs){
		const observable = this.observableTable[node.id];

		outputs.data = {
			name: node.id,
			observable: observable,
		}

		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			bool: (bool) => {
				if (bool){
					observable.next(bool);
				}
			},
		});

	}
}