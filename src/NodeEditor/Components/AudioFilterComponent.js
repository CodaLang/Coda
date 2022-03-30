

import Rete from "rete";
import { fromEvent, map, Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import * as Tone from "tone";
import Sockets from "../sockets";
import { AutoFilter, Filter } from "tone";

export default class AudioFilterComponent extends Rete.Component {
	constructor(){
		super("AudioFilter");
		this.observableTable = {}
		this.subscriptionTable = {}
		this.valueTable = {};
	}

	async builder(node){
		this.subscriptionTable[node.id] = {};
		this.observableTable[node.id] = new Subject();
		this.valueTable[node.id] = {
			filter : new AutoFilter(),
		}

		node
		.addInput(
			new Rete.Input("frequency", "Frequency", Sockets.NumValue)
		)
		.addOutput(
			new Rete.Output("data", "Filter", Sockets.AnyValue)
		)
	}

	worker(node, inputs, outputs){
		const observable = this.observableTable[node.id];
		outputs.data = {
			name: node.id,
			observable: observable,
			filter: this.valueTable[node.id].filter,
		};

		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			frequency: (frequencyNumber) => {
				this.valueTable[node.id].filter.set({
					frequency: inputs.frequency[0].num || frequencyNumber || 1
				})

				observable.next(this.valueTable[node.id].filter);
			},
		});
	}
}