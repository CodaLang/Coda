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
		let current = 0;

		outputs.data = {
			name: node.id,
			observable: this.observable,
			num: current,
		}

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			data: () => {
				current = node.data.num;
				console.log(node.data.num)
				this.observable.next(node.data.num);
			},
		})
	}
}