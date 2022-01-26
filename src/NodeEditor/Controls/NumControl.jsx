import React from "react";
import Rete from "rete";

class NumReactControl extends React.Component {

	componentDidMount(){

	}

	render(){
		return(
			<div>Yoo</div>
		)
	}

}

export default class NumControl extends Rete.Control {
	constructor(emitter, key, name){
		super(key);
		this.render = "react";
		this.component = NumReactControl;
		this.props = {emitter, name}
	}
}