import Rete from "rete";
import Sockets from "../../sockets";
import { Subject } from "rxjs";
import { handleSubscription } from "../../../utils";

export default class GreaterThan extends Rete.Component {
	constructor(){
		super(">");
		this.observableTable = {}
		this.subscriptionTable = {}
		this.valueTable = {};
	}

	async builder(node){
		this.subscriptionTable[node.id] = {};
		this.observableTable[node.id] = new Subject();
		this.valueTable[node.id] = {
			num1: 0,
			num2: 0,
		}

		node
		.addInput(
			new Rete.Input("num1", "Number", Sockets.AnyValue, true),
		)
		.addInput(
			new Rete.Input("num2", "Number", Sockets.AnyValue, true)
		)
		.addOutput(
			new Rete.Output("data", "Boolean", Sockets.BooleanValue)
		);
	}

	async worker(node, inputs, outputs){
		const observable = this.observableTable[node.id];

		outputs.data = {
			name: node.id,
			observable: observable,
		}

		const evaluate = (val1, val2) => {
			this.valueTable[node.id].num1 = inputs.num1 && inputs.num1[0] ? inputs.num1[0].num : 0;
			this.valueTable[node.id].num2 = inputs.num2 && inputs.num2[0] ? inputs.num2[0].num : 0;


			if (val1){
				this.valueTable[node.id].num1 = val1;
			}
			if (val2){
				this.valueTable[node.id].num2 = val2;
			}

			observable.next(this.valueTable[node.id].num1 > this.valueTable[node.id].num2)


		}

		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			num1: (val) => {
				evaluate(val);
			},

			num2: (val) => {
				evaluate(null, val);
			}
		});

	}
}