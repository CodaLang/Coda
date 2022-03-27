
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

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			synth: (synthObject) => {
				const fx = [];

				synthObject.triggerAttack(synthObject.noteName);

				if (synthObject.filterObject){
					fx.push(synthObject.filterObject);
				}

				synthObject.chain(...fx, Tone.Destination);
			},
		});
	}
}