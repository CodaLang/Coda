import Rete from "rete";
import Sockets from "../../sockets";
import { Subject, combineLatestWith, map, tap, combineLatest } from "rxjs";
import { handleSubscription } from "../../../utils";

export default class GreaterThan extends Rete.Component {
	constructor(){
		super(">");
		this.subscriptions = {};
		this.observable = new Subject();
		this.num1 = 0;
		this.num2 = 0;
	}

	async builder(node){
		node
		.addInput(
			new Rete.Input("num1", "Num", Sockets.NumValue, true),
		)
		.addInput(
			new Rete.Input("num2", "Num", Sockets.NumValue, true)
		)
		.addOutput(
			new Rete.Output("data", "Num", Sockets.BooleanValue)
		);
	}

	async worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable
		}

		const evaluate = () => {
			if (inputs.num1 && inputs.num1[0]){
				this.num1 = inputs.num1[0].num;
			}

			if (inputs.num2 && inputs.num2[0]){
				this.num2 = inputs.num2[0].num;
			}

			// console.log(this.num1, this.num2);
			if (this.num1 > this.num2){
				this.observable.next(true);
			}
			else {
				this.observable.next(false);
			}
		}

		console.log(inputs);

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			num1: (val) => {
				console.log("ran");
				evaluate();
			},

			num2: (val) => {
				evaluate();
			}
		});

	}
}