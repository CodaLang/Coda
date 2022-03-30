import Rete from "rete";
import { fromEvent, map, Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import * as Tone from "tone";
import Sockets from "../sockets";

const validNotes = ["a", "b", "c", "d", "e", "f", "g"];

export default class SynthesizerComponent extends Rete.Component {
	constructor(){
		super("Synthesizer");
		this.subscriptions = {};
		this.observable = new Subject();
		this.synth = new Tone.Synth();
		// this.filter = new Tone.Filter();

		this.synth.noteName = "C4";
		this.synth.filterObject = new Tone.AutoFilter();
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
			new Rete.Input("filter", "Filter?", Sockets.AnyValue)
		)
		.addInput(
			new Rete.Input("event", "Event?", Sockets.AnyValue)
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
		// console.log(inputs);

		const updateFromInputs = () => {
			let note = "C4";
			let volume = 0;

			const newSynth = new Tone.Synth();
			newSynth.filterObject = new Tone.AutoFilter();

			if (inputs.note && inputs.note[0]){
				note = inputs.note[0].string || note
			}

			if (inputs.volume && inputs.volume[0]){
				volume = inputs.volume[0].num || volume;
			}

			if (inputs.filter && inputs.filter[0]){
				const filterObj = inputs.filter[0].filter;
				newSynth.filterObject.set( filterObj ? filterObj.get() : {frequency: 0} );
			}

			// console.log(note, volume, newSynth.filterObject);

			newSynth.set({
				volume: volume
			});
			newSynth.noteToPlay = note;
			return newSynth;
		}

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			note: (noteString) => {
				if ( noteString.length >= 2 && validNotes.includes(noteString.charAt(0).toLowerCase()) && !isNaN(noteString.substring(1))){
					// console.log(noteString);
					// this.synth.set({
					// 	frequency: noteString,
					// 	volume: inputs.volume[0].num || 0,
					// });
					// this.synth.noteName = noteString;

					// if (inputs.filter[0] && inputs.filter[0].filter){
					// 	console.log(inputs.filter[0].filter.get());
					// 	this.synth.filterObject.set(inputs.filter[0].filter.get());
					// }

					this.observable.next(updateFromInputs());
				}
			},

			volume: (volumeValue) => {
				// this.synth.set({
				// 	frequency: inputs.note[0].string || "C4",
				// 	volume: volumeValue
				// });

				// if (inputs.filter[0] && inputs.filter[0].filter){
				// 	this.synth.filterObject.set(inputs.filter[0].filter.get());
				// }

				this.observable.next(updateFromInputs());
			},

			filter: (filterObj) => {
				// console.log("Ran");
				// this.synth.filterObject.set( filterObj ? filterObj.get() : {frequency: 0} );

				this.observable.next(updateFromInputs());
			},

			event: () => {
				const synth = updateFromInputs();
				// synth.triggerAttack("C4");
				// synth.toDestination();
				this.observable.next(synth);
			}
		});
		console.log(this.subscriptions);
	}
}