import React from "react";

export default class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		value: props.value
	};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
	this.props.onChange(event.target.value);
  }

  handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
          <input type="number" value={this.state.value} onChange={this.handleChange} />
      </form>
    );
  }
}
