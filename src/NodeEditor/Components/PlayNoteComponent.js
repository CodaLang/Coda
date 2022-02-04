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
		const input1 = new Rete.Input("data", "Data", Sockets.AnyValue);
		const output1 = new Rete.Input("data", "Output", Sockets.AnyValue);

		node.addInput(input1).addOutput(output1);
	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable
		};

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			data: (value) => {
				this.synth.triggerAttackRelease("C4", "8n");
                this.subject.next("C4");
			}
		});
	}
}