import Rete from "rete";
import Sockets from "../sockets";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import NumControl from "../Controls/NumControl";

// let last = null;

export default class NumComponent extends Rete.Component {
	constructor(){
		super("Number");
		this.subscriptionTable = {};
		this.observableTable = {};
	}

	async builder(node){
		this.observableTable[node.id] = new Subject();
		this.subscriptionTable[node.id] = {};

		const input = new Rete.Input("data", "Event", Sockets.AnyValue);
		const out = new Rete.Output("data", "Num", Sockets.NumValue);

		node.addControl(new NumControl(this.editor, "num", node)).addInput(input).addOutput(out);
	}

	worker(node, inputs, outputs){
		const observable = this.observableTable[node.id];

		outputs.data = {
			name: node.id,
			observable: observable,
			num: node.data.num || 0,
		}

		// console.log(inputs);
		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			data: () => {
				console.log("Ran");
				observable.next(node.data.num);
			},
		})
	}
}