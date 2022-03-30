

import Rete from "rete";
import { fromEvent, map, Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import * as Tone from "tone";
import Sockets from "../sockets";
import { AutoFilter, Filter } from "tone";

export default class AudioFilterComponent extends Rete.Component {
	constructor(){
		super("AudioFilter");
		this.subscriptions = {};
		this.observable = new Subject();
		this.filter = new AutoFilter();
	}

	async builder(node){
		node
		.addInput(
			new Rete.Input("frequency", "Frequency", Sockets.NumValue)
		)
		.addOutput(
			new Rete.Output("data", "Filter", Sockets.AnyValue)
		)
	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable,
			filter: this.filter,
		};

		console.log(inputs);
		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			frequency: (frequencyNumber) => {
				console.log(inputs.frequency[0].num);
				this.filter.set({
					frequency: inputs.frequency[0].num || frequencyNumber || 1
				})

				this.observable.next(this.filter);
			},
		});
	}
}