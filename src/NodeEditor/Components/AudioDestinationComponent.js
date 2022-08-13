
import Rete from "rete";
import { fromEvent, map, Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import * as Tone from "tone";
import Sockets from "../sockets";

export default class AudioDestinationComponent extends Rete.Component {
	constructor(){
		super("AudioDestination");
		// this.subscriptions = {};
		// this.observable = new Subject();
		// this.destinationSynth = new Tone.Synth();

		this.observableTable = {}
		this.subscriptionTable = {}
		this.valueTable = {};
	}

	async builder(node){

		this.subscriptionTable[node.id] = {};
		this.observableTable[node.id] = new Subject();
		this.valueTable[node.id] = {
			destinationSynth : new Tone.Synth()
		}

		node
		.addInput(
			new Rete.Input("synth", "Synthesizer", Sockets.AnyValue)
		)
		.addInput(
			new Rete.Input("release", "Release", Sockets.AnyValue)
		)
	}

	worker(node, inputs, outputs){
		const observable = this.observableTable[node.id];
		outputs.data = {
			name: node.id,
			observable: observable
		};

		// console.log(inputs);

		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			synth: (synthObject) => {
				const fx = [];
				this.valueTable[node.id].destinationSynth.dispose();
				// synthObject.triggerAttack("C4");
				// synthObject.toDestination();
				this.valueTable[node.id].destinationSynth = new Tone.Synth();
				this.valueTable[node.id].destinationSynth.set(synthObject.get());

				// console.log(synthObject.noteToPlay);
				// this.valueTable[node.id].destinationSynth.triggerAttack(synthObject.noteToPlay);
				// this.destinationSynth.triggerAttack(synthObject.noteToPlay)
				let releaseSettings = { };
				if (inputs.release && inputs.release[0]){
					releaseSettings = inputs.release[0].release
				}
				// console.log(releaseSettings);

				if (releaseSettings.type === "Attack"){
					this.valueTable[node.id].destinationSynth.triggerAttack(synthObject.noteToPlay);
				}
				else if (releaseSettings.type === "AttackRelease"){
					this.valueTable[node.id].destinationSynth.triggerAttackRelease(synthObject.noteToPlay, releaseSettings.duration, releaseSettings.delay);
				}
				else{
					console.warn("Release must be set on AudioDestination");
				}

				if (synthObject.filterObject){
					fx.push(synthObject.filterObject);
				}
				this.valueTable[node.id].destinationSynth.chain(...fx, Tone.Destination);
			},

			release: (releaseSetting) => {
				// console.log(time, typeof time);
				if (!this.valueTable[node.id].destinationSynth){
                    console.warn("AudioDestination component socket 1 is empty");
                    return;
                }

				let releaseSettings = {
					type: "Attack"
				}
				if (inputs.release && inputs.release[0]){
					releaseSettings = inputs.release[0].release
				}

				if (releaseSettings.type === "Attack"){
					this.valueTable[node.id].destinationSynth.triggerRelease();
				}

				// this.valueTable[node.id].destinationSynth.triggerRelease()
			}
		});
	}
}