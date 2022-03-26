
import React from "react";
import Rete from "rete";

export default class StringControl extends Rete.Control {
	static component = ({value, onChange}) => (
		<input
			type="text"
			value={value}
			ref={(ref) => {
				ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
			}}
			onChange={(e) => onChange(e.target.value)}
		/>
	)

	constructor(emitter, key, node, readonly=false){
		super(key);
		this.emitter = emitter;
		this.key = key;
		this.component = StringControl.component;
		this.render = "react";

		const initial = node.data[key] || "";

		node.data[key] = initial;
		this.props = {
			readonly,
			value: initial,
			onChange: (v) => {
				// console.log(v);
				if (node.controlStream){
					node.controlStream.next(v);
				}
				this.setValue(v);
				this.emitter.trigger("process");
			}
		};
	}

	setValue(val){
		this.props.value = val;
		this.putData(this.key, val);
		this.update();
	}
}