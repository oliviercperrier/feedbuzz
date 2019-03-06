import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ShowHidePW from '../ShowHidePW';

class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			error: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		const { email, password } = this.state;

		if (email && password) {
			this.props.handleLogin(email, password);
		}
	}

	render() {
		return (
			<div className="login-form-container has-text-centered">
				<h3 className="title is-4">Log into Feedbuzz to start giving feedback</h3>
				<div className="link">
					<Link to="" onClick={this.props.onSwitch}>
						Don't have an account?
					</Link>
				</div>
				<form className="auth-form" onSubmit={this.handleSubmit}>
					<div className="field">
						<div className="control">
							<input className="input" type="text" name="email" placeholder="Email" onChange={this.handleChange} />
						</div>
					</div>
					<ShowHidePW pwStrength={false} name="password" onChange={this.handleChange} />
					<div className="field">
						<div className="control">
							<button className="button bg-color-trans" type="submit">
								Log in
							</button>
						</div>
					</div>
				</form>
				<div className="link">
					<Link to="/forgot-password">Forgot your password?</Link>
				</div>
			</div>
		);
	}
}

LoginForm.propTypes = {
	onSwitch: PropTypes.func.isRequired,
	handleLogin: PropTypes.func.isRequired
};

export default LoginForm;
