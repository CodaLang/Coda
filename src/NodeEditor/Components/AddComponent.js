import Rete from "rete";
import Sockets from "../sockets";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";

export default class AddComponent extends Rete.Component {
	constructor(){
		super("Add");
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
			new Rete.Input("num", "Number", Sockets.NumValue),
		)
		.addInput(
			new Rete.Input("num2", "Number", Sockets.NumValue),
		)
		.addOutput(
			new Rete.Output("data", "Number", Sockets.NumValue)
		);
	}

	async worker(node, inputs, outputs){
		const observable = this.observableTable[node.id];
		outputs.data = {
			name: node.id,
			observable: observable
		}

		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			num: (value) => {
				if (!Number.isInteger(value)){
					console.warn("Must provide number value for Add component socket 1");
					return;
				}

				const num2 = inputs.num2 ? inputs.num2[0].num : null

				if (!num2){
					console.warn("Cannot add number value with second empty socket");
					return;
				}

				this.valueTable[node.id].num1 = value

				observable.next(value + num2);
			},

			num2: (value) => {
				if (!Number.isInteger(value)){
					console.warn("Must provide number value for Add component socket 2");
					return;
				}

				const num = inputs.num ? inputs.num[0].num : null

				if (!num){
					console.warn("Cannot add number value with first empty socket");
					return;
				}

				this.valueTable[node.id].num2 = value	
				observable.next(num + value);
			}
		})
	}
}