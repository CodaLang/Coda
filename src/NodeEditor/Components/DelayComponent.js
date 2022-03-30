import Rete from "rete";
import Sockets from "../sockets";
import { delay, Observable, Subject, tap } from "rxjs";
import { handleSubscription } from "../../utils";

export default class DelayComponent extends Rete.Component {
	constructor(){
		super("Delay");
		this.observableTable = {}
		this.subscriptionTable = {}
		this.finalObservableTable = {}
	}

	async builder(node){
		this.subscriptionTable[node.id] = {};
		this.observableTable[node.id] = new Subject();

		this.finalObservableTable[node.id] = new Subject();
		this.observableTable[node.id].subscribe(v => this.finalObservableTable[node.id].next(v));

		node
		.addInput(
			new Rete.Input("delay", "Delay", Sockets.AnyValue),
		)
		.addInput(
			new Rete.Input("event1", "Event", Sockets.AnyValue),
		)
		.addOutput(
			new Rete.Output("data", "Event", Sockets.AnyValue)
		)
	}

	async worker(node, inputs, outputs){
		const observable = this.observableTable[node.id];

		outputs.data = {
			name: node.id,
			observable: observable,
		}
		// observable.subscribe(console.log);

		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			delay: (n) => { },

			event1: (e) => {
				if (inputs.delay && inputs.delay[0]){

					// const delayed = new Observable(x => {
					// 	x.next();
					// }).pipe(
					// 	delay(5000),
					// );

					// delayed.subscribe(v => {
					// 	observable.next("s");
					// });

					setTimeout(() => {
						observable.next(e);
					}, inputs.delay[0].num);
				}
				else{
					observable.next(e);
				}
			},
		});

	}
}