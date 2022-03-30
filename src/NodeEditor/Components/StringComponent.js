import Rete from "rete";
import Sockets from "../sockets";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import StringControl from "../Controls/StringControl";

//main
export default class StringComponent extends Rete.Component {
	constructor(){
		super("String");
		this.subscriptions = {};
		this.observable = new Subject();
		// this.controlStream = new Subject();
	}

	async builder(node){
		const input = new Rete.Input("data", "Event", Sockets.AnyValue);
		const out = new Rete.Output("data", "String", Sockets.StringValue);

		node.addControl(new StringControl(this.editor, "string", node)).addInput(input).addOutput(out);
	}

	worker(node, inputs, outputs){
		let current = "";

		outputs.data = {
			name: node.id,
			observable: this.observable,
			string: node.data.string,
		}

		// this.subscriptions.nodeName = node.id;

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			data: () => {
				// console.log(node.id);
				current = node.data.string;
				this.observable.next(node.data.string);
			},
		})
		// console.log(node.id, inputs, this.subscriptions);
	}
}