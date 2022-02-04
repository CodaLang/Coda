import Rete from "rete";
import { interval, } from "rxjs";
// import { handleSubscription } from "../../../utils";
import Sockets from "../../sockets";

export default class WaveSignal extends Rete.Component {
	constructor(){
		super("WaveSignal");

		this.waveSignal = interval(1);
	}

	async builder(node){
		node
		.addOutput(new Rete.Output("data", "Num", Sockets.NumValue));
	}

	worker(node, inputs, outputs){

		outputs.data = {
			name: node.id,
			observable: this.waveSignal,
		}
	}
}