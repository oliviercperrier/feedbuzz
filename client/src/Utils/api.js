var axios = require('axios');
var TokenManager = require('./tokenManager');

export const API = axios.create();
API.defaults.baseURL = window.baseURL;
API.defaults.headers.post['Content-Type'] = 'application/json';

if (TokenManager.getAccessToken()) {
	API.defaults.headers.common['Authorization'] = 'Bearer ' + TokenManager.getAccessToken();
}

export const updateAPIHeader = function(token) {
	if (token) {
		API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
	} else {
		delete axios.defaults.headers.common['Authorization'];
	}
};

async function verifyTokenID() {
	return API.get('/auth/verify').catch(async function(error) {
		if (error.response.data.exception === 'InvalidToken') {
			const response = await API.post('/auth/refresh', {
				refresh_token: TokenManager.getRefreshToken()
			});

			TokenManager.updateAccessToken(response.data.access_token);
			updateAPIHeader(TokenManager.getAccessToken());
		}
	});
}

export const updateUser = async function(data) {
	await verifyTokenID();
	//call update user
};

export const getUser = async function() {
	await verifyTokenID();
	const response = await API.get('/auth/me');
	return response.data.me;
};
