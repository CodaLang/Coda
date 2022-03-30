
import Rete from "rete";
import Sockets from "../sockets";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";

export default class AttackComponent extends Rete.Component {
	constructor(){
		super("Attack");
		this.observableTable = {}
		this.subscriptionTable = {}
	}

	async builder(node){
		this.subscriptionTable[node.id] = {};
		this.observableTable[node.id] = new Subject();

		node
		.addInput(
			new Rete.Input("event", "Event", Sockets.AnyValue),
		)
		.addOutput(
			new Rete.Output("data", "Release", Sockets.AnyValue)
		)
	}

	async worker(node, inputs, outputs){
		const observable = this.observableTable[node.id];

		outputs.data = {
			name: node.id,
			observable: observable,
			release: {
				type: "Attack"
			}
		}

		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			event: () => {
				outputs.data.release = {
					type: "Attack",
				};

				this.observableTable[node.id].next({ type: "Attack"});
			},
		});

	}
}