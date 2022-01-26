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
		const out = new Rete.Output("num", "Num", Sockets.NumValue);

		node.addControl(new NumControl(this.editor, "num")).addInput(input).addOutput(out);
	}

	async worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable
		}

		this.subscriptions = handleSubscription(inputs, "data", this.subscriptions, () => {
			this.observable.next(2);
		})
	}
}