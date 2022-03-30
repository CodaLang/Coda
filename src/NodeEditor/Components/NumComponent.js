import Rete from "rete";
import Sockets from "../sockets";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import NumControl from "../Controls/NumControl";

export default class NumComponent extends Rete.Component {
	constructor(){
		super("Number");
		this.subscriptions = {};
		this.observable = new Subject();
	}

	async builder(node){
		const input = new Rete.Input("data", "Event", Sockets.AnyValue);
		const out = new Rete.Output("data", "Num", Sockets.NumValue);

		node.addControl(new NumControl(this.editor, "num", node)).addInput(input).addOutput(out);
	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable,
			num: node.data.num || 0,
		}

		// console.log(inputs);
		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			data: () => {
				console.log("Ran");
				this.observable.next(node.data.num);
			},
		})
	}
}