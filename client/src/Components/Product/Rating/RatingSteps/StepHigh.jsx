import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import PropTypes from 'prop-types';
import { FaRegSadTear, FaRegMeh, FaRegSmile, FaRegLaugh, FaRegGrinStars } from 'react-icons/fa';

/**
 * Product rating step 1
 */
class StepHigh extends Component {
	id = 0;

	constructor(props) {
		super(props);

		this.highStates = {
			0: FaRegSadTear,
			1: FaRegMeh,
			2: FaRegSmile,
			3: FaRegLaugh,
			4: FaRegGrinStars
		};

		this.state = {
			currentState: 0,
			value: this.props.data.value ? this.props.data.value : 0
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange = (value) => {
		var currentState = Math.round(value / 25);
		this.setState({
			value: currentState
		});
		this.props.onDataChange(this.id, { value: currentState });
	};

	render() {
		const { value } = this.state;
		const CurrentHighState = this.highStates[value];

		return (
			<div className="step1-container">
				<div className="step-header">
					<h1 className="step-title">How high were you?</h1>
				</div>
				<div className="v-and-h-centered high-state">
					<CurrentHighState />
				</div>
				<div className="slide-container">
					<Slider
						value={value * 25}
						min={0}
						max={100}
						tooltip={false}
						labels={{
							0: 'I was not',
							25: 'A little',
							50: 'Normal',
							75: 'Very',
							100: 'Wow'
						}}
						orientation="horizontal"
						onChange={this.handleChange}
					/>
				</div>
			</div>
		);
	}
}

StepHigh.propTypes = {
	onDataChange: PropTypes.func.isRequired
};

export default StepHigh;
