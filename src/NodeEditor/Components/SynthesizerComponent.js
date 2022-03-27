import Rete from "rete";
import { fromEvent, map, Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import * as Tone from "tone";
import Sockets from "../sockets";

export default class SynthesizerComponent extends Rete.Component {
	constructor(){
		super("Synthesizer");
		this.subscriptions = {};
		this.observable = new Subject();
		this.synth = new Tone.Synth();
		// this.filter = new Tone.Filter();

		this.synth.noteName = "C4";
		this.synth.filterObject = new Tone.Filter();
		// this.synth.chain(this.filter);
	}

	async builder(node){
		node
		.addInput(
			new Rete.Input("note", "Note", Sockets.StringValue)
		)
		.addInput(
			new Rete.Input("volume", "Volume", Sockets.NumValue)
		)
		.addInput(
			new Rete.Input("filter", "Filter", Sockets.AnyValue)
		)
		.addOutput(
			new Rete.Output("data", "Synthesizer", Sockets.AnyValue)
		)
	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable
		};

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			note: (noteString) => {
				console.log(noteString);
				this.synth.set({
					frequency: noteString
				});
				this.synth.noteName = noteString;
				this.observable.next(this.synth);
			},

			volume: (volumeValue) => {
				console.log(volumeValue);
				this.synth.set({
					volume: volumeValue
				});
				this.observable.next(this.synth)
			},

			filter: (filterObj) => {
				this.synth.filterObject.set( filterObj ? filterObj.get() : {frequency: 0} );

				this.observable.next(this.synth);
			}
		});
	}
}