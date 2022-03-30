import Rete from "rete";
import Sockets from "../sockets";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";

export default class HeadComponent extends Rete.Component {
	constructor(){
		super("Head");
		this.observableTable = {}
		this.subscriptionTable = {}
	}

	async builder(node){
		this.subscriptionTable[node.id] = {};
		this.observableTable[node.id] = new Subject();

		node
		.addInput(
			new Rete.Input("list", "List<A>", Sockets.AnyValue),
		)
		.addOutput(
			new Rete.Output("data", "A", Sockets.AnyValue)
		)
	}

	async worker(node, inputs, outputs){
		const observable = this.observableTable[node.id];

		outputs.data = {
			name: node.id,
			observable: observable,
		}

		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			list: (list) => {
				console.log(list);
				observable.next(list[0]);
			},
		});

	}
}