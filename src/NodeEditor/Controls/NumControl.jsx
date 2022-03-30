import React from "react";
import Rete from "rete";
// import InputForm from "../../Components/InputForm";

// class NumReaVctControl extends React.Component {
// 	constructor(){
// 		super();
// 		this.state = {
// 			value: 0
// 		}
// 	}

// 	handleChange = (num) => {
// 		this.setState({value: num});
// 	}

// 	render(){
// 		return(
// 			<div>
// 				<InputForm onChange={this.handleChange} value={this.state.value} className="rounded bg-white">
// 					{this.state.value}
// 				</InputForm>
// 			</div>
// 		)
// 	}

// }

export default class NumControl extends Rete.Control {
	static component = ({value, onChange}) => (
		<input
			type="number"
			value={value}
			ref={(ref) => {
				ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
			}}
			onChange={(e) => onChange(+e.target.value)}
		/>
	)

	constructor(emitter, key, node, readonly=false){
		super(key);
		this.emitter = emitter;
		this.key = key;
		this.component = ({value, onChange}) => (
			<input
				type="number"
				value={value}
				ref={(ref) => {
					ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
				}}
				onChange={(e) => onChange(+e.target.value)}
			/>
		)

		this.render = "react";

		const initial = node.data[key] || 0;

		node.data[key] = initial;
		this.props = {
			readonly,
			value: initial,
			onChange: (v) => {
				this.setValue(v);
				this.emitter.trigger("process");
			}
		};
	}

	setValue(val){
		this.props.value = val;
		this.putData(this.key, val)
		this.update()
	}
}