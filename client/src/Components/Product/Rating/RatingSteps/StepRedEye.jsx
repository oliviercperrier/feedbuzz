import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import PropTypes from 'prop-types';

/**
 * Product rating step 2
 */
class StepRedEye extends Component {
	id = 1;

	constructor(props) {
		super(props);

		this.state = {
			value: this.props.data.value ? this.props.data.value : 0
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange = (value) => {
		this.setState({
			value: value
		});
		this.props.onDataChange(this.id, { value: value });
	};

	render() {
		const { value } = this.state;
		var eyeColor = 'rgba(255, 0, 0,' + value / 100 + ')';

		return (
			<div className="step2-container">
				<div className="step-header">
					<h1 className="step-title">How red were your eyes?</h1>
				</div>
				<div className="eyes v-and-h-centered">
					<div className="eye left-eye" style={{ background: eyeColor }}>
						<div className="ball">
							<div className="pupille" />
						</div>
					</div>
					<div className="eye" style={{ background: eyeColor }}>
						<div className="ball">
							<div className="pupille" />
						</div>
					</div>
				</div>
				<div className="slide-container">
					<Slider
						value={value}
						min={0}
						max={100}
						tooltip={false}
						labels={{
							0: '0%',
							20: '20%',
							40: '40%',
							60: '60%',
							80: '80%',
							100: '100%'
						}}
						orientation="horizontal"
						onChange={this.handleChange}
					/>
				</div>
			</div>
		);
	}
}

StepRedEye.propTypes = {
	onDataChange: PropTypes.func.isRequired
};

export default StepRedEye;
