import Rete from "rete";
import Sockets from "../sockets";
import { Subject } from "rxjs";
import { handleSubscription } from "../../utils";

export default class AttackReleaseComponent extends Rete.Component {
	constructor(){
		super("AttackRelease");
		this.observableTable = {}
		this.subscriptionTable = {}
	}

	async builder(node){
		this.subscriptionTable[node.id] = {};
		this.observableTable[node.id] = new Subject();

		node
		.addInput(
			new Rete.Input("duration", "Duration", Sockets.AnyValue),
		)
		.addOutput(
			new Rete.Output("data", "Release", Sockets.AnyValue)
		)
	}

	async worker(node, inputs, outputs){
		const observable = this.observableTable[node.id];

		outputs.data = {
			name: node.id,
			observable: observable,
		}

		if (inputs.duration && inputs.duration[0]){
			outputs.data.release = {
				type: "AttackRelease",
				duration: inputs.duration[0].num
			};
		}


		this.subscriptionTable[node.id] = handleSubscription(inputs, this.subscriptionTable[node.id], {
			duration: (durationValue) => {
				outputs.data.release = {
					type: "AttackRelease",
					duration: durationValue
				};

				this.observableTable[node.id].next({ type: "AttackRelease", duration: durationValue});
			},
		});

	}
}