import React, { Component } from 'react';

import { AuthProvider } from '../../Contexts/authContext';
import { API, updateAPIHeader, getUser } from '../../Utils/api';
import TokenManager from '../../Utils/tokenManager';
import Storage from '../../Utils/browserStorage';

/**
 * Main Provider for authContext
 * 
 * Manage user authentification and registration
 * Allow to access authentication data all around the app
 */
class Auth extends Component {
	constructor(props) {
		super(props);

		const current_usr = Storage.getStorage().getItem('usr_info');

		if (current_usr) {
			this.state = { 
				authenticated: this.isAuthenticated(),
				user: JSON.parse(current_usr)
			};
		} else {
			this.state = { authenticated: false };
		}

		this.checkAuthentication = this.checkAuthentication.bind(this);
		this.login = this.login.bind(this);
		this.signup = this.signup.bind(this);
		this.logout = this.logout.bind(this);
	}

	async checkAuthentication() {
		const authenticated = this.isAuthenticated();

		if (authenticated !== this.state.authenticated) {
			const usr_info = await getUser();
			Storage.getStorage().setItem('usr_info', JSON.stringify(usr_info));
			this.setState({
				authenticated,
				user: usr_info
			});
		}
	}

	async componentDidMount() {
		this.checkAuthentication();
	}

	async componentDidUpdate() {
		this.checkAuthentication();
	}

	/* TODO FIX CHECK */
	isAuthenticated() {
		return !!TokenManager.getAccessToken();
	}

	async login(email, password) {
		const auth_res = await API.post('/auth', {
			email: email,
			password: password
		});

		const access_token = auth_res.data.access_token;
		const refresh_token = auth_res.data.refresh_token;

		if (access_token && refresh_token) {
			updateAPIHeader(access_token);
			TokenManager.updateAccessToken(access_token);
			TokenManager.updateRefreshToken(refresh_token);

			const usr_info = await getUser();
			Storage.getStorage().setItem('usr_info', JSON.stringify(usr_info));

			this.setState({
				authenticated: true,
				user: usr_info
			});
		}
	}

	async signup(name, username, email, password) {
		const auth_res = await API.post('/api/user/signup', {
			email: email,
			name: name,
			username: username,
			password: password
		});

		if (auth_res.data.success) {
			this.login(email, password);
		}
	}

	logout() {
		updateAPIHeader('');
		TokenManager.clearTokens();
		Storage.getStorage().setItem('usr_info', null);
		this.setState({ authenticated: false });
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
