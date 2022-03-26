
import Rete from "rete";
import { fromEvent, map, Subject } from "rxjs";
import { handleSubscription } from "../../utils";
import * as Tone from "tone";
import Sockets from "../sockets";

export default class OscillateNoteComponent extends Rete.Component {
	constructor(){
		super("OscillateNote");
		this.subscriptions = {};
		this.observable = new Subject();
		this.osc = new Tone.Oscillator().toDestination();
		this.signal = new Tone.Signal({
			value: "C4",
			units: "frequency",
		});
		this.rampTo = "C5";
		this.startNote = "C4";
		this.toggle = false;
	}

	async builder(node){
		const input1 = new Rete.Input("data", "StartNote", Sockets.AnyValue);
		const input2 = new Rete.Input("data2", "RampNote", Sockets.AnyValue);
		const input3 = new Rete.Input("event", "Event", Sockets.AnyValue);
		const output1 = new Rete.Output("data", "Output", Sockets.AnyValue);

		node.addInput(input1).addInput(input2).addInput(input3).addOutput(output1);
	}

	worker(node, inputs, outputs){
		outputs.data = {
			name: node.id,
			observable: this.observable
		};

		this.subscriptions = handleSubscription(inputs, this.subscriptions, {
			data: (value) => {
				this.startNote = value;
			},

			data2: (value) => {
				this.rampTo = value;
			},

			event: () => {
				this.toggle = !this.toggle;
				console.log(inputs);

				const startNote = inputs.data[0].string;
				const endNote = inputs.data2[0].string;

				if(this.toggle){
					this.signal = new Tone.Signal({
						value: startNote,
						units: "frequency",
					});

					// console.log("Ran");

					this.osc.start();
					this.signal.connect(this.osc.frequency);

					this.signal.rampTo(endNote, 2, "+1");

					this.observable.next(endNote);
				}
				else{
					this.signal.disconnect();
				}
			}
		});

	}
}