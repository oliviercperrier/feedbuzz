import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ShowHidePW from '../ShowHidePW';

class SignupForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			username: '',
			email: '',
			password: '',
			confirmpassword: '',
			error: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value });
	};

	handleSubmit(e) {
		e.preventDefault();
		const { name, username, email, password, confirmpassword } = this.state;
		//make validation on signup data
		//Password == confirmPassword and email valid
		if (name && username && email && password && confirmpassword && password === confirmpassword) {
			this.props.handleSignup(name, username, email, password);
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
							<input
								className="input"
								type="text"
								name="name"
								placeholder="Name"
								onChange={this.handleChange}
							/>
						</div>
					</div>
					<div className="field">
						<div className="control">
							<input
								className="input"
								type="text"
								name="username"
								placeholder="Username"
								onChange={this.handleChange}
							/>
						</div>
					</div>
					<div className="field">
						<div className="control">
							<input
								className="input"
								type="text"
								name="email"
								placeholder="Email"
								onChange={this.handleChange}
							/>
						</div>
					</div>
					<ShowHidePW pwStrength={true} name="password" onChange={this.handleChange} />
					<ShowHidePW
						pwStrength={true}
						name="confirmpassword"
						onChange={this.handleChange}
						placeholder="Confirm password"
					/>
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
