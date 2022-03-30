import Rete from "rete";
import Sockets from "../sockets";
import { Subject, combineLatestWith, map, tap, combineLatest } from "rxjs";
import { handleSubscription } from "../../utils";

export default class AddComponent extends Rete.Component {
	constructor(){
		super("Add");
		this.subscriptions = {};
		this.observable = new Subject();
		this.num1 = null;
		this.num2 = null;
	}

	async builder(node){
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
		outputs.data = {
			name: node.id,
			observable: this.observable
		}

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			num: (value) => {
				if (!Number.isInteger(value)){
					console.warn("Must provide number value for Add component socket 1");
					return;
				}

				if (!this.num2){
					console.warn("Cannot add number value with empty socket");
					return;
				}

				this.num1 = value
				this.observable.next(this.num1 + this.num2);
			},

			num2: (value) => {
				if (!Number.isInteger(value)){
					console.warn("Must provide number value for Add component socket 2");
					return;
				}

				if (!this.num1){
					console.warn("Cannot add number value with empty socket");
					return;
				}

				this.num2 = value	
				this.observable.next(this.num1 + this.num2);
			}
		})

		// if (this.subscriptions.length !== 0){
		// 	Object.values(this.subscriptions).forEach(sub => {
		// 		sub.unsubscribe();
		// 	})
		// 	this.subscriptions = {};
		// }

		// if(inputs.num.length === 1){
		// 	this.subscriptions[inputs.num[0].name] = inputs.num[0].observable.subscribe( (num) => {
		// 		this.observable.next(num);
		// 	});
		// }
		// else if (inputs.num.length > 1) {
		// 	const observablesToSub = [];

		// 	inputs.num.forEach(input => {
		// 		observablesToSub.push(input.observable);
		// 	})

		// 	const sub = combineLatest(
		// 		inputs.num.map(input => input.observable)
		// 	).pipe(
		// 		tap((...vals) => {
		// 			console.log(vals);
		// 			return vals;
		// 		}),
		// 		map((...vals) => {
		// 			return vals.reduce((acc, val) => Number(acc) + Number(val), 0);
		// 		})
		// 	).subscribe(x => {
		// 		this.observable.next(x);
		// 	})

		// 	for (let i = 0; i < inputs.num.length; i++){
		// 		this.subscriptions[inputs.num[i].name] = sub;
		// 	}
		// }
	}
}