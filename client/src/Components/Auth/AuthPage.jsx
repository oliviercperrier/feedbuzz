import React, { Component } from 'react';
import { withLastLocation } from 'react-router-last-location';
import { Redirect, Link } from 'react-router-dom';
import { MdClose } from 'react-icons/md';

import { AuthConsumer } from '../../Contexts/authContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

/**
 * Consumer of authContext
 * Authentification page displaying login form or signup form
 * 
 * Route: /authenticate
 */
class AuthPage extends Component {
	constructor(props) {
		super(props);
		var showLoginForm = true;

		if (this.props.location.state && this.props.location.state.showSignupForm) {
			showLoginForm = false;
		}

		this.state = {
			showLoginForm: showLoginForm,
			closed: false
		};

		this.onSwitch = this.onSwitch.bind(this);
		this.onClose = this.onClose.bind(this);
	}

	onSwitch(e) {
		e.preventDefault();
		e.nativeEvent.stopImmediatePropagation();
		const { showLoginForm } = this.state;
		this.setState({ showLoginForm: !showLoginForm });
	}

	onClose(e) {
		this.setState({ closed: true });
	}

	render() {
		const { showLoginForm, closed } = this.state;
		const lastLocation = this.props.lastLocation ? this.props.lastLocation : { pathname: '/' };

		return (
			<AuthConsumer>
				{({ authenticated, login, signup }) => {
					return authenticated || closed ? (
						<Redirect to={authenticated ? lastLocation.pathname : '/'} />
					) : (
						<div className="auth-content section">
							<div className="header has-text-centered">
								<Link to="/">
									<img
										className="feedbuzz-icon"
										alt="Feedbuzz"
										src="img/feedbuzz_logo_small_cropped.png"
									/>
								</Link>
								<MdClose className="full-pg-close big-btn bg-color-trans" onClick={this.onClose} />
							</div>
							{showLoginForm ? (
								<LoginForm onSwitch={this.onSwitch} handleLogin={login} />
							) : (
								<SignupForm onSwitch={this.onSwitch} handleSignup={signup} />
							)}
						</div>
					);
				}}
			</AuthConsumer>
		);
	}
}

export default withLastLocation(AuthPage);
