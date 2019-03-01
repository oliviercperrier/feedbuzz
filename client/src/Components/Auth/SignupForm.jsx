import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ShowHidePW from '../ShowHidePW';

class SignupForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			confirmPassword: '',
			error: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUsrChange = this.handleUsrChange.bind(this);
		this.handlePWChange = this.handlePWChange.bind(this);
		this.handleConfPWChange = this.handleConfPWChange.bind(this);
	}

	handleUsrChange = (e) => {
		this.setState({ email: e.target.value });
	};

	handlePWChange = (pw) => {
		this.setState({ password: pw });
	};

	handleConfPWChange = (pw) => {
		this.setState({ confirmPassword: pw });
	};

	handleSubmit(e) {
		e.preventDefault();
		const { email, password, confirmPassword } = this.state;
		//make validation on signup data
		//Password == confirmPassword and email valid
		if (email && password && confirmPassword) {
			this.props.handleSignup(email, password, confirmPassword);
		}
	}

	render() {
		return (
			<div className="signup-form-container has-text-centered">
				<h3 className="title is-4">Create your Feedbuzz account to start giving feedback!</h3>
				<div className="link">
					<Link to="" onClick={this.props.onSwitch}>
						Already have an account?
					</Link>
				</div>
				<form className="auth-form" onSubmit={this.handleSubmit}>
					<div className="field">
						<div className="control">
							<input className="input" type="text" placeholder="Email" onChange={this.handleUsrChange} />
						</div>
					</div>
					<ShowHidePW pwStrength={true} onChange={this.handlePWChange} />
					<ShowHidePW pwStrength={true} onChange={this.handleConfPWChange} placeholder="Confirm password" />
					<div className="field">
						<div className="control">
							<button className="button bg-color-trans" type="submit">
								Register
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

SignupForm.propTypes = {
	onSwitch: PropTypes.func.isRequired,
	handleSignup: PropTypes.func.isRequired
};

export default SignupForm;
