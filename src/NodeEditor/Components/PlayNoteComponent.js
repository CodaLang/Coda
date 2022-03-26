import Rete from "rete";
import { fromEvent, map, Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import * as Tone from "tone";
import Sockets from "../sockets";

export default class PlayNoteComponent extends Rete.Component {
	constructor(){
		super("PlayNote");
		this.subscriptions = {};
		this.observable = new Subject();
		this.synth = new Tone.Synth().toDestination();
	}

	async builder(node){
		const input1 = new Rete.Input("noteData", "String", Sockets.AnyValue);
		const input2 = new Rete.Input("data", "Data", Sockets.AnyValue);
		const output1 = new Rete.Output("data", "Output", Sockets.AnyValue);

		node.addInput(input1).addInput(input2).addOutput(output1);
	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable
		};

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			noteData: () => {
				console.log("run")
			},

			data: (value) => {
				console.log(inputs);
				const startNote = inputs.noteData[0].string || "C4";
				this.synth.triggerAttackRelease(startNote, "8n");
                this.observable.next("C4");
			}
		});
	}
}