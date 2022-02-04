import Rete from "rete";
import { interval, Subject, switchMap } from "rxjs";
import { handleSubscription } from "../../../utils";
import Sockets from "../../sockets";


export default class IntervalSignal extends Rete.Component {
	constructor(){
		super("IntervalSignal");

		this.intervalStream = new Subject().pipe(
			switchMap(delta => interval(delta))
		);
		this.intervalStream.next(1000);
		this.subscriptions = {};
	}

	async builder(node){
		node
		.addInput(new Rete.Input("num", "Num", Sockets.NumValue))
		.addOutput(new Rete.Output("data", "Num", Sockets.NumValue));
	}

	worker(node, inputs, outputs){

		outputs.data = {
			name: node.id,
			observable: this.intervalStream,
		}

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			num: (n) => {
				console.assert(Number.isInteger(n));
				this.intervalStream.next(n);
			}
		})
	}
}