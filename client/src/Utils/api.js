var axios = require('axios');
var TokenManager = require('./tokenManager');

export const API = axios.create();
API.defaults.baseURL = window.baseURL;
API.defaults.headers.post['Content-Type'] = 'application/json';

if (TokenManager.getTokenID()) {
	API.defaults.headers.common['Authorization'] = 'Bearer ' + TokenManager.getTokenID();
}

export const updateAPIHeader = function(token) {
	if (token) {
		API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
	} else {
		delete axios.defaults.headers.common["Authorization"];
	}
};

async function verifyTokenID() {
	const response = await API.get('/auth/verify');

	if (!response.data.valid) {
		const response = await API.get('/auth/refresh', {
			refresh_token: TokenManager.getTokenID()
		});

		updateAPIHeader(response.data.access_token);
		TokenManager.updateTokenID(response.data.access_token);
	}
}

export const getUser = async function() {
	await verifyTokenID();
	const response = await API.get('/auth/me');
	return response.data.me;
}
