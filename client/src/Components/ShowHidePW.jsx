import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdRemoveRedEye, MdMoreHoriz } from 'react-icons/md';

import zxcvbn from 'zxcvbn';

class ShowHidePW extends Component {
	constructor(props) {
		super(props);

		this.state = {
			type: 'password',
			score: 'null'
		};
	}

	evaluatePWStrenght = (e) => {
		let val = e.target.value;

		this.setState({
			score: val === '' ? 'null' : zxcvbn(val).score
		});

		//Give input value to parent Component
		this.props.onChange(val);
	};

	onShowHide = (e) => {
		const { type } = this.state;
		this.setState({ type: type === 'input' ? 'password' : 'input' });
	};

	renderStrengthBar = () => {
		if (this.props.pwStrength) {
			return <span className="pw-input-strength" data-score={this.state.score} />;
		}

		return '';
	};

	render() {
		const { placeholder } = this.props;

		return (
			<div className="sh-pw-input-container field">
				<div className="control">
					<input
						type={this.state.type}
						placeholder={placeholder ? placeholder : 'password'}
						className="input"
						onChange={this.evaluatePWStrenght}
					/>
					<div className="sh-icon-wrapper v-and-h-centered" onClick={this.onShowHide}>
						<span className="icon pw-input-show bg-color-trans">
							{this.state.type === 'input' ? <MdMoreHoriz /> : <MdRemoveRedEye />}
						</span>
					</div>
				</div>
				{this.renderStrengthBar()}
			</div>
		);
	}
}

ShowHidePW.propTypes = {
	pwStrength: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired
};

export default ShowHidePW;
