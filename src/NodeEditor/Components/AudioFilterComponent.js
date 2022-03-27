

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
			new Rete.Output("filter", "Filter", Sockets.AnyValue)
		)
	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable
		};

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			frequency: (frequencyNumber) => {
				console.log(frequencyNumber);
				this.filter.set({
					frequency: frequencyNumber
				})

				this.observable.next(this.filter);
			},
		});
	}
}