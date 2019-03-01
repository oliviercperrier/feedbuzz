import React, { Component } from 'react';

import { AuthProvider } from '../../Contexts/authContext';
import { API, updateAPIHeader, getUser } from '../../Utils/api';
import TokenManager from '../../Utils/tokenManager';

/**
 * Main Provider for authContext
 * 
 * Manage user authentification and registration
 * Allow to access authentication data all around the app
 */
class Auth extends Component {
	constructor(props) {
		super(props);
		this.state = { authenticated: false };
		this.checkAuthentication = this.checkAuthentication.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	async checkAuthentication() {
		const authenticated = await this.isAuthenticated();
		
		if (authenticated !== this.state.authenticated) {
			this.setState({ 
				authenticated,
				user: await getUser()
			 });
		}
	}

	async componentDidMount() {
		this.checkAuthentication();
	}

	async componentDidUpdate() {
		this.checkAuthentication();
	}

	async isAuthenticated() {
		return !!TokenManager.getTokenID();
	}

	async login(email, password) {
		const auth_res = await API.post('/auth', {
			username: email,
			password: password
		});

		const token_id = auth_res.data.access_token

		if (token_id) {
			updateAPIHeader(token_id);
			TokenManager.updateTokenID(token_id);

			this.setState({ 
				authenticated: true,
				user: await getUser()
			});
		}
	}

	logout() {
		updateAPIHeader('');
		TokenManager.clearTokenID();
		this.setState({ authenticated: false });
	}

	async signup(email, password, confirmPassword) {
		console.log('email : ' + email);
		console.log('password : ' + password);
		console.log('confirm password : ' + confirmPassword);
	}

	render() {
		const authProviderValue = {
			...this.state,
			login: this.login,
			signup: this.signup,
			logout: this.logout
		};

		return <AuthProvider value={authProviderValue}>{this.props.children}</AuthProvider>;
	}
}

export default Auth;
