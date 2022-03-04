import Rete from "rete";
import Sockets from "../sockets";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import StringControl from "../Controls/StringControl";

export default class StringComponent extends Rete.Component {
	constructor(){
		super("String");
		this.subscriptions = {};
		this.observable = new Subject();
	}

	async builder(node){
		const input = new Rete.Input("data", "Event", Sockets.AnyValue);
		const out = new Rete.Output("data", "String", Sockets.StringValue);

		node.addControl(new StringControl(this.editor, "string", node)).addInput(input).addOutput(out);
	}

	worker(node, inputs, outputs){
		let current = 0;

		outputs.data = {
			name: node.id,
			observable: this.observable,
			string: current,
		}

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			data: () => {
				current = node.data.string;
				console.log(node.data.string)
				this.observable.next(node.data.string);
			},
		})
	}
}