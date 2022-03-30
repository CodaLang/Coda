
import Rete from "rete";
import { fromEvent, map, Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import * as Tone from "tone";
import Sockets from "../sockets";

export default class AudioDestinationComponent extends Rete.Component {
	constructor(){
		super("AudioDestination");
		this.subscriptions = {};
		this.observable = new Subject();
		this.destinationSynth = new Tone.Synth();
	}

	async builder(node){
		node
		.addInput(
			new Rete.Input("synth", "Synth", Sockets.AnyValue)
		)
	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable
		};

		console.log(inputs);
		// if (inputs.synth && inputs.synth[0]){
		// 	const inputSynth = inputs.synth[0].synth;
		// 	this.destinationSynth = new Tone.Synth();
		// 	this.destinationSynth.set(inputSynth.get());
		// }


		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			synth: (synthObject) => {
				const fx = [];
				// console.log(synthObject);
				console.log(synthObject);

				// this.destinationSynth.triggerRelease();
				this.destinationSynth.dispose();
				// synthObject.triggerAttack("C4");
				// synthObject.toDestination();

				this.destinationSynth = new Tone.Synth();
				this.destinationSynth.set(synthObject.get());

				console.log(synthObject.noteToPlay);
				this.destinationSynth.triggerAttack(synthObject.noteToPlay)

				if (synthObject.filterObject){
					fx.push(synthObject.filterObject);
				}
				this.destinationSynth.chain(...fx, Tone.Destination);
			},
		});
	}
}