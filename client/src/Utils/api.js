var axios = require('axios');
var TokenManager = require('./tokenManager');

export const API = axios.create();
API.defaults.baseURL = window.baseURL;
API.defaults.headers.post['Content-Type'] = 'application/json';

export const updateAPIHeader = function(token) {
	if (token) {
		API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
	} else {
		delete axios.defaults.headers.common["Authorization"];
	}
};

async function verifyTokenID() {
	const response = await API.get('/auth/verify');

	if (!response.valid) {
		const res = await API.get('/auth/refresh', {
			refresh_token: TokenManager.getTokenID()
		});

		updateAPIHeader(res.access_token);
		TokenManager.updateTokenID(res.access_token);
	}
}
