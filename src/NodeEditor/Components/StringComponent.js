import Rete from "rete";
import Sockets from "../sockets";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import StringControl from "../Controls/StringControl";

//main
export default class StringComponent extends Rete.Component {
	constructor(){
		super("String");
		this.subscriptionTable = {};
		this.observableTable = {};
	}

	async builder(node){
		this.observableTable[node.id] = new Subject();
		this.subscriptionTable[node.id] = {};

		const input = new Rete.Input("data", "Event", Sockets.AnyValue);
		const out = new Rete.Output("data", "String", Sockets.StringValue);

		node.addControl(new StringControl(this.editor, "string", node)).addInput(input).addOutput(out);
	}

	worker(node, inputs, outputs){
		const observable = this.observableTable[node.id];
		outputs.data = {
			name: node.id,
			observable: observable,
			string: node.data.string,
		}


		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			data: () => {
				observable.next(node.data.string);
			},
		})
	}
}